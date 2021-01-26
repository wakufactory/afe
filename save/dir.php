<?php
$t = $_GET['dir'] ;
if(preg_match("/\.\./",$t)) exit ;
$t = getcwd()."/".$t;
$fp = opendir($t) ;
$d = array() ;
while($f = readdir($fp)) {
	if($f=="."||$f=="..") continue ;
	$fn = $t."/".$f ;
	$d[] = array("name"=>$f,"mtime"=>date("Y-m-d H:i:s",filemtime($fn)),"size"=>filesize($fn)) ;
}
usort($d,function($a,$b) {
	return $a['mtime']>$b['mtime'] ;
});
echo json_encode($d) ;