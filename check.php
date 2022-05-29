<?php
    $NicName = filter_var(trim($_POST['name']),FILTER_SANITIZE_STRING);
    $Score = filter_var(trim($_POST['score']),FILTER_SANITIZE_STRING);
    echo $NicName
    if(trim($NicName)==''){
        $NicName='GuestUser';
    }
    if(trim($Score)==''){
        $Score='666';
    }


    $mysql = new mysqli('localhost','root','root','scoretable');
    $mysql->query("INSERT INTO `namerecord` (`NicName`, `Score`) VALUES ('$NicName', '$Score')");
    $mysql->close();
    header('Location: /');
    exit();



    

?>