<?php ini_set('default_charset','UTF-8');header('Content-Type: text/html; charset=UTF-8');header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');header('Cache-Control: post-check=0, pre-check=0', false);header('Pragma: no-cache'); ?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Blog</title>
<meta name="referrer" content="same-origin">
<meta name="robots" content="max-image-preview:large">
<meta name="viewport" content="width=960">
<?php

    $pages = 10;
    $page = (isset($_GET['page']) ? $_GET['page'] : 1);
    if($page < 1) {
        $page = 1;
    }
    $current_page = 1;
    $current_result = 0;

    $blogName = 'blog-index';
    $blogJSON = file_get_contents($blogName . '.json');
    if($blogJSON === FALSE) {
        echo $blogName;
        exit(-1);
    }

    $blogData = json_decode($blogJSON, TRUE);
    if($blogData == NULL) {
        echo "JSON";
        exit(-2);
    }

    $blogPostsPerPage = $blogData['blogPostsPerPage'];
    $blogPostsMargin = $blogData['blogPostsMargin'];
    $blogPosts = $blogData['blogPosts'];
    $tag = (isset($_GET['tag']) ? $_GET['tag'] : NULL);
    if($tag !== NULL) {
        $filteredBlogPosts = array();
        foreach($blogPosts as $blogPost) {
            if(in_array($tag, $blogPost['tags'])) {
                $filteredBlogPosts[] = $blogPost;
            }
        }
        $blogPosts = $filteredBlogPosts;
    }
    $devices = $blogData['devices'];
    $css = $blogData['css'];
    $mq = $blogData['mq'];

    $end_page = $page + $pages / 2 - 1;
    if($end_page < $pages) {
        $end_page = $pages;
    }
    $blogPostsCount = count($blogPosts);
    $blogPostsPages = intval(($blogPostsCount - 1) / $blogPostsPerPage) + 1;
    if($blogPostsPages < $end_page) {
        $end_page = $blogPostsPages;
    }

    $start_page = $end_page + 1 - $pages;
    if($start_page < 1) {
        $start_page = 1;
    }

    $style = '';
    foreach($devices as $deviceInfo) {
        $pos = strpos($deviceInfo, ':');
        $device = substr($deviceInfo, 0, $pos);
        $deviceWidth = substr($deviceInfo, $pos + 1);
        if(!isset($css[$device])) continue;
        $deviceCSSClasses = $css[$device];
        $mediaQuery = (isset($mq[$device]) ? $mq[$device] : NULL);
        if($mediaQuery !== NULL) {
            $style .= "@media " . $mediaQuery . ' {';
        }
        $style .= ".bpwc{width:100%;margin:auto}";
        $style .= ".bpc{width:" . $deviceWidth . "px;margin:auto}";
        $style .= ".bpm{margin-top:" . $blogPostsMargin[$device] . "px}";
        $cssClassesAdded = array();
        $blogPostIndex = ($page - 1) * $blogPostsPerPage;
        $count = 0;
        while($blogPostIndex < $blogPostsCount && ++$count <= $blogPostsPerPage) {
            $blogPost = $blogPosts[$blogPostIndex++];

            $cssClasses = $blogPost['cssClasses'];
            foreach($cssClasses as $cssClass) {
                if(!in_array($cssClass, $cssClassesAdded) && isset($deviceCSSClasses[$cssClass])) {
                    $style .= $deviceCSSClasses[$cssClass];
                }
                $cssClassesAdded[] = $cssClass;
            }
        }
        if($mediaQuery !== NULL) {
            $style .= '}';
        }
    }
    echo "<style>" . $style . "</style>";

?>

<script>var currDev=function(){return 0}</script>
<link rel="preload" href="css/Poppins-Regular.woff2" as="font" crossorigin>
<style>html,body{-webkit-text-zoom:reset !important}@font-face{font-display:block;font-family:"Limelight";src:url('css/Limelight-Regular.woff2') format('woff2'),url('css/Limelight-Regular.woff') format('woff');font-weight:400}@font-face{font-display:block;font-family:"Poppins";src:url('css/Poppins-Regular.woff2') format('woff2'),url('css/Poppins-Regular.woff') format('woff');font-weight:400}@font-face{font-display:block;font-family:"Lato";src:url('css/Lato-Regular.woff2') format('woff2'),url('css/Lato-Regular.woff') format('woff');font-weight:400}body>div{font-size:0}p,span,h1,h2,h3,h4,h5,h6,a,li{margin:0;word-spacing:normal;word-wrap:break-word;-ms-word-wrap:break-word;pointer-events:auto;-ms-text-size-adjust:none !important;-moz-text-size-adjust:none !important;-webkit-text-size-adjust:none !important;text-size-adjust:none !important;max-height:10000000px}sup{font-size:inherit;vertical-align:baseline;position:relative;top:-0.4em}sub{font-size:inherit;vertical-align:baseline;position:relative;top:0.4em}ul{display:block;word-spacing:normal;word-wrap:break-word;list-style-type:none;padding:0;margin:0;-moz-padding-start:0;-khtml-padding-start:0;-webkit-padding-start:0;-o-padding-start:0;-padding-start:0;-webkit-margin-before:0;-webkit-margin-after:0}li{display:block;white-space:normal}li p{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}form{display:inline-block}a{text-decoration:inherit;color:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0)}textarea{resize:none}.shm-l{float:left;clear:left}.shm-r{float:right;clear:right}.btf{display:none}.plyr{min-width:0 !important}html{font-family:sans-serif}body{font-size:0;margin:0}audio,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background:0 0;outline:0}b,strong{font-weight:700}dfn{font-style:italic}h1,h2,h3,h4,h5,h6{font-size:1em;line-height:1;margin:0}img{border:0}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=submit]{-webkit-appearance:button;cursor:pointer;box-sizing:border-box;white-space:normal}input[type=text],input[type=password],input[type=email],input[type=date],input[type=number],textarea{-webkit-appearance:none;appearance:none;box-sizing:border-box}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}textarea{overflow:auto;box-sizing:border-box;border-color:#ddd}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}blockquote{margin-block-start:0;margin-block-end:0;margin-inline-start:0;margin-inline-end:0}:-webkit-full-screen-ancestor:not(iframe){-webkit-clip-path:initial!important}
html{-webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale}.menu-content{cursor:pointer;position:relative}li{-webkit-tap-highlight-color:rgba(0,0,0,0)}
#b{background-color:#fff}.v7{display:inline-block;vertical-align:top}.ps16{position:relative;margin-top:0}.s18{width:100%;min-width:960px;min-height:74px}.c33{z-index:2;pointer-events:none}.s19{width:100%;min-width:960px;min-height:73px}.c34{z-index:3;border:0;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;background-color:#90b94d;background-clip:padding-box}.ps17{position:relative;margin-top:-65px}.v8{display:block;vertical-align:top}.s20{min-width:960px;width:960px;margin-left:auto;margin-right:auto;min-height:66px}.v9{display:inline-block;vertical-align:top;overflow:visible}.ps18{position:relative;margin-left:10px;margin-top:0}.s21{min-width:473px;width:473px;min-height:66px;height:66px}.c35{z-index:4;pointer-events:auto}.ps19{position:relative;margin-left:0;margin-top:0}.m2{padding:0px 0px 0px 0px}.ml2{outline:0}.s22{min-width:236px;width:236px;min-height:66px;height:66px}.mcv2{display:inline-block}.s23{min-width:236px;width:236px;min-height:66px}.c36{pointer-events:none;border:0;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;background-color:transparent;background-clip:padding-box}.c37{pointer-events:auto;overflow:hidden;height:66px}.p4{text-indent:0;padding-bottom:0;padding-right:0;text-align:center}.f8{font-family:Limelight;font-size:44px;font-size:calc(44px * var(--f));line-height:1.342;font-weight:400;font-style:normal;text-decoration:none;text-transform:none;letter-spacing:normal;color:#9b1e23;background-color:initial;text-shadow:none}.ps20{position:relative;margin-left:1px;margin-top:0}.c38{pointer-events:none;border:0;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;background-color:transparent;background-clip:padding-box}.ps21{position:relative;margin-top:-8px}.s24{width:100%;min-width:960px;min-height:1297px}.c39{z-index:1;pointer-events:none;border:0;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;background-color:#68a8de;background-clip:padding-box}.v10{display:inline-block;vertical-align:top;overflow:hidden}.ps22{position:relative;margin-top:-1280px}.s25{width:100%;min-width:960px}.c40{z-index:5;pointer-events:none}.s26{min-width:960px;width:960px;margin-left:auto;margin-right:auto;min-height:1393px}.s27{width:100%;min-width:960px;min-height:289px}.c41{z-index:6}.ps23{position:relative;margin-left:846px;margin-top:0}.s28{min-width:104px;width:104px;min-height:41px}.c42{z-index:7;pointer-events:auto;overflow:hidden;height:41px}.p5{text-indent:0;padding-bottom:0;padding-right:0;text-align:left}.f9{font-family:Poppins;font-size:18px;font-size:calc(18px * var(--f));line-height:1.779;font-weight:400;font-style:normal;text-decoration:none;text-transform:none;letter-spacing:normal;color:#000;background-color:initial;text-shadow:none}.ps24{position:relative;margin-left:42px;margin-top:-37px}.s29{min-width:67px;width:67px;min-height:37px}.c43{z-index:11;pointer-events:auto;overflow:hidden;height:37px}.f10{font-family:"Arial Black", "Arial Bold", Gadget, sans-serif;font-size:19px;font-size:calc(19px * var(--f));line-height:1.948;font-weight:700;font-style:normal;text-decoration:none;text-transform:none;letter-spacing:normal;color:#9b1e23;background-color:initial;text-shadow:none}.ps25{position:relative;margin-left:-89px;margin-top:-35px}.s30{min-width:110px;width:110px;min-height:30px}.c44{z-index:10;border:0;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;background-color:#90b94d;background-clip:padding-box}.ps26{position:relative;margin-left:0;margin-top:-35px}.c45{z-index:8;pointer-events:auto}.f11{font-family:"Arial Black", "Arial Bold", Gadget, sans-serif;font-size:19px;font-size:calc(19px * var(--f));line-height:1.422;font-weight:700;font-style:normal;text-decoration:none;text-transform:none;letter-spacing:normal;text-shadow:none;text-indent:0;text-align:center;padding-top:2px;padding-bottom:1px;margin-top:0;margin-bottom:0}.btn13{border:0;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;background-color:#90b94d;background-clip:padding-box;color:#9b1e23}.btn13:hover{background-color:#aba9aa;border-color:#000;color:#9b1e23}.btn13:active{background-color:#aba9aa;border-color:#000;color:#9b1e23}.v11{display:inline-block;overflow:hidden;outline:0}.s31{width:110px;padding-right:0;height:27px}.ps27{position:relative;margin-left:-220px;margin-top:19px}.s32{min-width:220px;width:220px;min-height:229px;height:229px}.c46{z-index:9;pointer-events:auto}.i3{position:absolute;left:0;width:220px;height:229px;top:0}.i4{width:100%;height:100%;display:inline-block;-webkit-transform:translate3d(0,0,0)}.ps28{position:relative;margin-left:20px;margin-top:19px}.s33{min-width:690px;width:690px;min-height:229px}.c47{z-index:12;pointer-events:auto;overflow:hidden;height:229px}.f12{font-family:Poppins;font-size:18px;font-size:calc(18px * var(--f));line-height:2.279;font-weight:400;font-style:normal;text-decoration:none;text-transform:none;letter-spacing:normal;color:#000;background-color:initial;text-shadow:none}.s34{width:100%;min-width:960px;min-height:276px}.c48{z-index:13}.s35{min-width:720px;width:720px;min-height:47px}.c49{z-index:14;pointer-events:auto;overflow:hidden;height:47px}.f13{font-family:Lato;font-size:36px;font-size:calc(36px * var(--f));line-height:1.307;font-weight:400;font-style:normal;text-decoration:underline;text-transform:none;letter-spacing:normal;color:#000;background-color:initial;text-shadow:none}.ps29{position:relative;margin-left:116px;margin-top:0}.c50{z-index:15;pointer-events:auto;overflow:hidden;height:41px}.c51{z-index:17;pointer-events:auto}.ps30{position:relative;margin-left:20px;margin-top:0}.s36{min-width:700px;width:700px;min-height:229px}.c52{z-index:16;pointer-events:auto;overflow:hidden;height:229px}.c53{z-index:18}.c54{z-index:19;pointer-events:auto;overflow:hidden;height:47px}.f14{font-family:Poppins;font-size:18px;font-size:calc(18px * var(--f));line-height:1.779;font-weight:400;font-style:normal;text-decoration:underline;text-transform:none;letter-spacing:normal;color:#000;background-color:initial;text-shadow:none}.c55{z-index:20;pointer-events:auto;overflow:hidden;height:41px}.c56{z-index:22;pointer-events:auto}.c57{z-index:21;pointer-events:auto;overflow:hidden;height:229px}@media (prefers-color-scheme: dark) {#b{background-color:#000}.c34{background-color:#384850}.f8{color:#677a85}.c39{background-color:#14222a}.f9{color:#fffefe}.f10{color:#677a85}.c44{background-color:#384850}.f11{color:#677a85}.btn13{background-color:#384850}.f12{color:#fffefe}.f13{color:#fffefe}.f14{color:#fffefe}}</style>
<link onload="this.media='all';this.onload=null;" rel="stylesheet" href="css/site.314f70.css" media="print">
</head>
<body id="b">
<div class="v7 ps16 s18 c33">
<div class="v7 ps16 s19 c34"></div>
<div class="ps17 v8 s20">
<div class="v9 ps18 s21 c35">
<ul class="menu-dropdown v7 ps19 s21 m2" id="m1">
<li class="v7 ps19 s22 mit2">
<a href="./" class="ml2"><div class="menu-content mcv2"><div class="v7 ps19 s23 c36"><div class="v7 ps19 s23 c37"><p class="p4 f8">Home</p></div></div></div></a>
</li>
<li class="v7 ps20 s22 mit2">
<a href="#" class="ml2"><div class="menu-content mcv2"><div class="v7 ps19 s23 c38"><div class="v7 ps19 s23 c37"><p class="p4 f8">Blog</p></div></div></div></a>
</li>
</ul>
</div>
</div>
</div>
<div class="v7 ps21 s24 c39"></div>
<div class="v10 ps22 s25 c40">
<?php

    $blogPostIndex = ($page - 1) * $blogPostsPerPage;
    $documentReady = '';
    $documentLoad = '';
    $facebookFix = '';
    $resizeImages = '';
    $animations = '';
    $count = 0;
    while($blogPostIndex < $blogPostsCount && ++$count <= $blogPostsPerPage) {
        $blogPost = $blogPosts[$blogPostIndex++];

        echo '<article class="bp';
        if($blogPost['w']) echo 'w';
        echo 'c';
        if($count > 1) echo ' bpm';
        echo '">';
        echo $blogPost['html'];
        echo '</article>';

        $documentReady .= $blogPost['documentReady'];
        $documentLoad .= $blogPost['documentLoad'];
        $facebookFix .= $blogPost['facebookFix'];
        $resizeImages .= $blogPost['resizeImages'];
        $animations .= $blogPost['animations'];
    }

    echo '<script>var blogDocumentReady=function(){' . $documentReady . '}';
    echo ',blogDocumentLoad=function(){' . $documentLoad . '}';
    echo ',blogFacebookFix=function(){' . $facebookFix . '}';
    echo ',blogResizeImages=function(){' . $resizeImages . '}';
    echo ',blogAnimationsSetup=function(){' . $animations . '}';
    echo '</script>';

?>

</div>
<div class="btf ps11 v5 s14">
<div class="v4 ps13 s15 c19">
<div class="ps12">
<?php

    echo '<style>.pbdn{display:none}.pbc{border: 0;background-color:#c0c0c0;color:#fff;border-color:#9b1e23}@media (prefers-color-scheme: dark) {.pbc{background-color:#353535;color:#000;border-color:#677a85}}</style>';
    $control = '<div class="v4 ps14 s16 c20 {btnclass}"><a href="#" class="f7 btn1 v6 s17 {lnkclass}">&lt;&lt;</a></div>';
    if($page > 1) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . ($page - 1);
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        $control = str_replace('href="#"', 'href="' . $url . '"', $control);
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c21 {btnclass}"><a href="#" class="f7 btn2 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 1 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c22 {btnclass}"><a href="#" class="f7 btn3 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 2 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c23 {btnclass}"><a href="#" class="f7 btn4 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 3 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c24 {btnclass}"><a href="#" class="f7 btn5 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 4 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c25 {btnclass}"><a href="#" class="f7 btn6 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 5 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c26 {btnclass}"><a href="#" class="f7 btn7 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 6 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c27 {btnclass}"><a href="#" class="f7 btn8 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 7 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c28 {btnclass}"><a href="#" class="f7 btn9 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 8 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c29 {btnclass}"><a href="#" class="f7 btn10 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 9 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c30 {btnclass}"><a href="#" class="f7 btn11 v6 s17 {lnkclass}">{page_num}</a></div>';
    $buttonPage = $start_page + 10 - 1;
    if($buttonPage <= $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . $buttonPage;
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        if($buttonPage == $page) {
            $control = str_replace('href="#"', '', $control);
            $control = str_replace('{lnkclass}', 'pbc', $control);
        }
        else {
            $control = str_replace('href="#"', 'href="' . $url . '"', $control);
            $control = str_replace('{lnkclass}', '', $control);
        }
        $control = str_replace('{page_num}', $buttonPage, $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{page_num}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

<?php

    $control = '<div class="v4 ps15 s16 c31 {btnclass}"><a href="#" class="f7 btn12 v6 s17 {lnkclass}">&gt;&gt;</a></div>';
    if($page < $end_page) {
        $url = strtok($_SERVER['REQUEST_URI'],'?') . '?page=' . ($page + 1);
        if($tag !== NULL) {
            $url .= '&tag=' . $tag;
        }
        $control = str_replace('href="#"', 'href="' . $url . '"', $control);
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{btnclass}', '', $control);
    }
    else {
        $control = str_replace('{lnkclass}', '', $control);
        $control = str_replace('{btnclass}', 'pbdn', $control);
    }
    echo $control;

?>

</div>
</div>
</div>
<div class="btf c32">
</div>
<script>var p=document.createElement("P");p.innerHTML="&nbsp;",p.style.cssText="position:fixed;visible:hidden;font-size:100px;zoom:1",document.body.appendChild(p);var rsz=function(e){return function(){var r=Math.trunc(1e3/parseFloat(window.getComputedStyle(e).getPropertyValue("font-size")))/10,t=document.body;r!=t.style.getPropertyValue("--f")&&t.style.setProperty("--f",r)}}(p);if("ResizeObserver"in window){var ro=new ResizeObserver(rsz);ro.observe(p)}else if("requestAnimationFrame"in window){var raf=function(){rsz(),requestAnimationFrame(raf)};requestAnimationFrame(raf)}else setInterval(rsz,100);</script>

<script>dpth="/";!function(){for(var e=["js/jquery.230098.js","js/jqueryui.230098.js","js/menu.230098.js","js/menu-dropdown-animations.230098.js","js/menu-dropdown.314f70.js","js/blog-index.314f70.js"],n={},s=-1,t=function(t){var o=new XMLHttpRequest;o.open("GET",e[t],!0),o.onload=function(){for(n[t]=o.responseText;s<6&&void 0!==n[s+1];){s++;var e=document.createElement("script");e.textContent=n[s],document.body.appendChild(e)}},o.send()},o=0;o<6;o++)t(o)}();
</script>
</body>
</html>