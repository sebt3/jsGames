#!/bin/bash
DIR="$(cd "$(dirname $0)";pwd)"
DEST=$DIR
Final=0
if [ $# -gt 0 ];then
	Final=1
	DEST="$DIR/docs"
	mkdir -p $DEST
fi
rem_ink() {
	sed 's/inkscape.*\\>/\>/;s/inkscape.*>/>/;/inkscape/d' "$1"|awk '/<g/,/>/{printf($0)}/<path/,/\/>/{printf($0)}/\/>/{print ""}/<svg/,/>/{printf($0)}/<\/g>/{print}/<\/svg>/{print}'|sed 's/[ \t][ \t]*/ /g'
}

cat >${DEST}/index.html<<END
<html>
 <head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
END
if [ $Final -eq 1 ];then
	echo "  <style>">>${DEST}/index.html
	for i in $DIR/css/*.css;do
		cat "css/$(basename $i)">>${DEST}/index.html
	done
	echo "  </style>">>${DEST}/index.html
else
	for i in $DIR/css/*.css;do
		echo "  <link href=\"css/$(basename $i)\" rel=\"stylesheet\" type=\"text/css\" />">>${DEST}/index.html
	done
fi
cat >>${DEST}/index.html<<END
  <title>jsGames</title>
 </head>
 <body>
  <ul>
END

for g in 2048 idler; do
	echo "   <li><a href='$g.html'>$g</a></li>">>${DEST}/index.html
	{
	cat <<ENDF
<html>
 <head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$g - jsGames</title>
  <style>
ENDF
	if [ -e "$g/font.txt" ];then
	while read name;do
		echo "@import url(https://fonts.googleapis.com/css?family=$name);"
	done <"$g/font.txt"
	fi
	if [ $Final -eq 1 ];then
		cat $DIR/css/*.css
		if [ -d $DIR/$g/css ];then
			cat $DIR/$g/css/*.css
		fi
		echo "  </style>"
	else
		echo "  </style>"
		for i in $DIR/css/*.css;do
			echo "  <link href=\"css/$(basename $i)\" rel=\"stylesheet\" type=\"text/css\" />"
		done
		if [ -d $DIR/$g/css ];then
			for i in $DIR/$g/css/*.css;do
				echo "  <link href=\"$g/css/$(basename $i)\" rel=\"stylesheet\" type=\"text/css\" />"
			done
		fi
	fi
	cat <<ENDF
 </head>
 <body>
  <div class="hidden" id="svg">
ENDF
	for i in $DIR/svg/*.svg $DIR/$g/svg/*.svg;do
		n=$(basename $i);n=${n%.*}
		[ "$n" = "*" ] && continue
		echo "   <div class=\"svg\" id=\"$n\">"
		rem_ink "$i"
		echo "   </div>"
	done
	cat <<ENDF
  </div>
  <div id="game"></div>
ENDF
	if [ $Final -eq 1 ];then
		echo "  <script>"
			uglifyjs.terser js/*.js $g/js/*.js
		echo "  </script>"
	else
		for i in $DIR/js/*.js;do
			echo "  <script src=\"js/$(basename $i)\"></script>"
		done
		for i in $DIR/$g/js/*.js;do
			echo "  <script src=\"$g/js/$(basename $i)\"></script>"
		done
	fi
	cat <<ENDF
 </body>
</html>
ENDF
} >${DEST}/$g.html
done
cat >>${DEST}/index.html<<END
  </ul>
 </body>
</html>
END
