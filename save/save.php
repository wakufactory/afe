<?php
$f = $_POST['fname'].".json" ;
$d = $_POST['data'] ;
$fp = fopen("data/".$f,"w") ;
fputs($fp,$d) ;
fclose($fp) ;
echo '{"status":0}' ;