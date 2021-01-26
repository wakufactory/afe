<?php
$d = $_POST['data'] ;
if(!json_decode($d) || !preg_match("/^[a-zA-Z0-9\-\_]+$/",$_POST['fname'])) {
	echo '{"status":-1}' ;
	exit ;
}
$f = $_POST['fname'].".json" ;
$fp = fopen("data/".$f,"w") ;
fputs($fp,$d) ;
fclose($fp) ;
echo '{"status":0}' ;