<?php
    if(isset($_GET["gamestats"]) && isset($_GET["player") && $_GET["gamestats"]!=="" && $_GET["player"]!=="") {
        $stmt = $conn->prepare("INSERT INTO `users` (`email`,`registration_timestamp`,`json`) VALUES (?,?,?)");
        $time = time();
        if ($stmt&& 
            $stmt->bind_param('isi',$_GET["player"],$time,$_GET["gamestats"])&&
            $stmt->execute()
        ) {
            echo 0; //success
        }
        else {
            echo 1; //db problem
        }
    }
    else {
        echo 2; //data problem
    }
?>