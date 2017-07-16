<?php
    
class YearController extends CController
{
    //上行短信回调
    public function actionIndex ()
    {   
        $mobile = Yii::app ()->getRequest()->getParam('mobile');  // 获取手机号
        $mobile_arr = array("13916543049","18602180065","13062623595","18403080001");  // 有效手机号数组
        if ( in_array($mobile, $mobile_arr) ) {  // 判断手机号是否有效
            unset($mobile_arr);  // 释放掉大数组
            $content = Yii::app ()->getRequest()->getParam('msg');  // 获取短信内容
            $contents = explode("," , preg_replace("/(\n)|(\s)|(\t)|(\')|(')|(，)/"  , ',' , $content) );  // 转换中英文逗号 并分割数组
            $start = @file_get_contents("protected/runtime/time.txt");  // 读取时间文件并抑制报错
            if ( $start == false ) {  // 如果没有时间戳，是2017年1月14日20点整的
                $start = strtotime("2017-1-14 20:00:00");
            }   

            foreach ( $contents as $key => $value ) 
            {  // 循环新数组
                $command = Yii::app ()->db->createCommand();
                $command -> select( "count(id)" );
                $command -> from( 'tek_year' );
                $command -> andwhere( 'mobile=:mobile' , array(':mobile' => $mobile) );
                $command -> andwhere( "create_date >= " . $start );  // 开始时间
                $number = $command -> queryScalar();
                if ( $number > 2 || $key > 2 ) {  // 只要前三个投票
                    break;
                }
                $time = time();  // 时间戳
                $sql = "INSERT tek_year  (content, mobile, create_date ) values ( '{$value}', '{$mobile}', '{$time}' )";  // 生成SQL
                Yii::app ()->db->createCommand($sql)->execute();  // 执行SQL
            }
        }
    }

    //投票数据查询
    public function actionVote ()
    {
        $events = Yii::app()->getRequest()->getParam('events');  // 获取EVENTS
        if ( $events == 1 ) {  // 判断是不是开始操作
            Yii::app ()->getUser()->setState( "start", time() );  // 设置SESSION
            file_put_contents("protected/runtime/time.txt", time() );  // 保存时间到文件内
        }
        $command = Yii::app()->db->createCommand();
        $command->select("count(distinct mobile) as votes, content as `order` ");  // 不重复手机号
        $command->from('tek_year');
        $command->andwhere("content >= 1");  // 开始编号
        $command->andwhere("content <= 15");  // 结束时间
        $command->andwhere("create_date >= " . Yii::app ()->getUser()->getState("start", file_get_contents("protected/runtime/time.txt") ) );  // 开始时间
        $command->andwhere("create_date <= " . time());  // 结束时间
        $command->group('content');  // 节目号分组
        $list = $command->queryAll();
        $data['list'] = $list;
        if ( $events == 0 ) {  // 如果点击了结束循环排序
            $champion = array();
            foreach ($list as $key=>$value) 
            {
                $champion[$value['votes']][]=$value['order'];
            }   
            krsort($champion);  // 键名反向排序
            $data['champion'] = array(current($champion), next($champion), next($champion));  // 获取前三名
        } else {
            $data['champion'] = "";
        }

        echo json_encode($data);  // 返回JSON
    }
    
}