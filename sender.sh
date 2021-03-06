#!/bin/bash
#set -x
#enter in to path
cd /var/www/html/rec

#creating log

DATENOWIS=$(date +"%Y-%m-%d")
LOGNAME="-sender.log"
LOGFILE=$DATENOWIS$LOGNAME
FFMPEGLOGFILE='ffmpeg.log'
NOW=$(date +"%Y-%m-%d %T") 
echo "$NOW ------------------------ Process started ------------------------ " >> $LOGFILE
#get file names
files=$(ls | grep nfo)

CLIENTFILE="client";
AGENTFILE="agent";

FINALFILE="final";
for file in $files
do
	#count ready words
	isready=$(grep -o -c finished $file)
	#f=$(grep -o -c "finished: client" test);
	#d=$( grep -o -c "finished: agent" test); 
	#isready=$((f+d)); 
	if [[ $isready = "2" ]] 

	then 
		NOW=$(date +"%Y-%m-%d %T")
		echo "$NOW Processing $file" >> $LOGFILE	
		#processing files by sendint to filenet
		increment=0
		
		cat $file | while read line
		do
			((increment++))
			iin=${file:0:${#file} - 4}
			FINALFILE="$iin.mkv"

			if [[ $increment = "1" ]]
			then 
				#get role of video
				role=$(echo $line | tr -d '\r'| awk {'printf $1'})
				file1=$(echo $line | tr -d '\r'| awk {'printf $4'})

				if [[ $role = "agent" ]]
				then
					#echo "ffmpeg -v quiet -y -i $file1 -vn -ar 44100 -ac 2 -ab 192 -f mp3 agent_sound.mp3"
					ffmpeg -v quiet -y -i "$file1" -vn -ar 44100 -ac 2 -ab 192 -f mp3 agent_sound.mp3 </dev/null
					mv "$file1" trash/"$file1"
					AGENTFILE=$file1
				else
					CLIENTFILE=$file1
				fi
			fi
			if [[ $increment = "2" ]]
			then 
				role=$(echo $line | tr -d '\r'| awk {'printf $1'})
				file2=$(echo  $line | tr -d '\r'| awk {'printf $4'})

				if [[ $role = "client" ]]
				then
					CLIENTFILE=$file2
					#echo "ffmpeg -v quiet -i agent_sound.mp3 -i $CLIENTFILE $FINALFILE"
					ffmpeg -v quiet -i "$CLIENTFILE" -i agent_sound.mp3 -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 0:v -map "[a]" -c:v copy -c:a libvorbis -ac 2 -shortest "$FINALFILE" </dev/null
					mv "$CLIENTFILE" trash/"$CLIENTFILE"
					#ffmpeg -v quiet -i agent_sound.mp3 -i "$CLIENTFILE" "$FINALFILE"
				else
					#echo "ffmpeg -v quiet -y -i $file2 -vn -ar 44100 -ac 2 -ab 192 -f mp3 agent_sound.mp3"
					ffmpeg -v quiet -y -i "$file2" -vn -ar 44100 -ac 2 -ab 192 -f mp3 agent_sound.mp3 </dev/null
					mv "$file2" trash/"$file2"
					#echo "ffmpeg -v quiet -i agent_sound.mp3 -i $CLIENTFILE $FINALFILE"
					clientvideoline=$(head -n 1 $file)
					clientfile=$(echo  $clientvideoline | tr -d '\r'| awk {'printf $4'})
					ffmpeg -i "$clientfile" -i agent_sound.mp3 -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 0:v -map "[a]" -c:v copy -c:a libvorbis -ac 2 -shortest "$FINALFILE" </dev/null
					AGENTFILE=$file2
					mv "$clientfile" trash/"$clientfile"
				fi

				RESULTOFREST=`curl -F "File=@$FINALFILE" -F "DocumentType=VEREF" -H "Role:Client" -H "IIN:$iin" -H "Content-Type:multipart/form-data" --request POST http://192.168.15.3:9082/ecmapi/json/documents?DocumentType=VEREF`
				NOW=$(date +"%Y-%m-%d %T")
				echo "$NOW finale file : $FINALFILE Send result: $RESULTOFREST" >> $LOGFILE
				
			fi
		done

		NOW=$(date +"%Y-%m-%d %T")
		echo "$NOW Removing files $CLIENTFILE $AGENTFILE $FINALFILE agent_sound.mp3" >> $LOGFILE
		rm agent_sound.mp3
		echo "finished" >> $file

		filenamesended=${file:0:${#file} - 4}
		mv "$filenamesended.mkv" sended/"$filenamesended.mkv"
		mv $file trash/$file
		echo "$NOW *" >> $LOGFILE
	fi
done