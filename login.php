<?php
	session_start();
	$code = trim($_POST["verifycode"]);
	if(isset($code)){
		if(strtolower($code) == $_SESSION['authcode']){
			echo '1';
		}
	}else{
		echo "";
	}
