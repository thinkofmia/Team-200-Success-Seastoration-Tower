<?php
if(!isset($_SESSION)) {
    session_start();
}
// secrets.php contains database login credentials: 
// $db_host = 'localhost';
// $db_user = 'username';
// $db_pass = 'password';
// $db_name = 'db_name';
include 'secrets.php';

// create db connection
$conn = new mysqli($db_host,$db_user,$db_pass,$db_name)
or die("Connect failed: %s\n". $conn -> error);

?>