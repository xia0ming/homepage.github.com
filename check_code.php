<?php
session_start(); 
$code = trim($_POST['verifycode']); 
if(strtolower($code)==strtolower($_SESSION["authcode"])){
	//登陆
}else{
	//错误
}