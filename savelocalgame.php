<?php
    if(isset($_GET["gamestats"]) && $_GET["gamestats"]!=="") {
        if(!isset($_SESSION)) {
            session_start();
        }
        if($_SESSION["gamestats"] = $_GET["gamestats"]) {
            echo 0; //success
        }
        else {
            echo 1; //session problem
        }
    }
    else {
        echo 2; //data problem
    }
?>