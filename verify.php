<?php
	session_start();

	$image = imagecreatetruecolor(80, 35);
	$bgcolor = imagecolorallocate($image, 44, 44, 44);
	imagefill($image, 0, 0, $bgcolor);

	$fontsize = rand(14,18);
	$fontcolor = imagecolorallocate($image, mt_rand(200,250), mt_rand(210,240), mt_rand(180,220));
	$pixelsnum = 80;
	$pixelscolor = imagecolorallocate($image, rand(140,160), rand(140,160), rand(140,160));
	$linesnum = 2;
	$linescolor = imagecolorallocate($image, rand(160,180), rand(160,180), rand(160,180));
	$fontfile = 'msyh.ttf';

	$verifycode = "";
	#验证码内容 数字
	// for ($i=0; $i < 4 ; $i++) { 
	// 	$fontcontent = rand(0,9);

	// 	$fontx = ($i*80/4) + rand(2,5);
	// 	$fonty = rand(8,13);

	// 	imagestring($image, $fontsize, $fontx, $fonty, $fontcontent, $fontcolor);
	// }
	#验证码内容 数字与字母
	for ($i=0; $i < 4 ; $i++) { 
		#去掉易混淆的字母数字 如o/0等
		$data = "abcdefghijkmnpqrstuvwxy3456789";
		$fontcontent = substr($data, rand(0,strlen($data)-1),1);
		$verifycode .= $fontcontent;

		$fontx = ($i*80/4) + rand(2,5);
		$fonty = rand(8,13);

		imagestring($image, $fontsize, $fontx, $fonty, $fontcontent, $fontcolor);
	   // imagettftext($image, $fontsize, rand(-10,10), $fontx, $fonty, $fontcolor, $fontfile, $fontcontent);
	}
	$_SESSION['authcode'] = $verifycode;

	#验证码干扰点
	for ($i=0; $i < $pixelsnum; $i++) { 
		imagesetpixel($image, rand(0,80), rand(0,35), $pixelscolor);
	}
	#验证码干扰线
	for ($i=0; $i < $linesnum; $i++) { 
		imageline($image, rand(3,75), rand(3,30), rand(3,75), rand(3,30), $linescolor);
	}

	header("content-type: image/png");
	imagepng($image);
	imagedestroy($image);