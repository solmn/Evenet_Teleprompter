import { Component ,HostListener,ChangeDetectorRef} from '@angular/core';
import { Http, Response } from '@angular/http';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  S = 83,
  T = 84,
  Y = 89,
  D = 68,
  F = 70,
  SPACE = 32,
  ENTER = 13
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EveNet Teleprompter';
  current_index = 0;
  scripts = []
  emotions = ["Happy", "Surprise", "Angry"]
  emotions2 = ["Happy", "Surprise", "Angry"]
  curent_script= "";
  current_emotion = "";
  downloadJsonHref:any;
  scripts_font_size = 5;
  font = "";
  emoji = "";
  timer:any;
  this:any;
  hr = "00";
  min = "00";
  sec = "00";
  hr2 = 0;
  min2 = 0;
  sec2 = 0;
  csvUrl: string = 'assets/text_emotion.csv';  // URL to web API
  csvData: any[] = [];
  loger:Loger[] = [];
  log:Loger;
  isReacording_started = false;
  private d = new Date();
  sad_c = 0;
  happy_c = 0;
  angry_c =0;
  sur_c = 0;
  date = "";
  isTimer_started = false;
  sad = [];
  happy = [];
  surprise = [];
  angry = [];
  sad_emo = [];
  angry_emo = [];
  surprise_emo = [];
  happy_emo = [];
  is_shown = false;
  clip = "";
  constructor(private http: Http,private sanitizer: DomSanitizer){
    this.date = this.d.toString();
  	this.curent_script = this.scripts[this.current_index];
  	this.current_emotion = this.emotions[this.current_index];
  	this.font = this.scripts_font_size + "rem";
  	this.emoji = "assets/emoji/"+this.emotions[this.current_index] + ".png";
    this.readCsvData();
   
  }

  format_emotion_labels(emo, trans){
    if(trans.startsWith("jsdfshfsdfsdfg37846sdfsd8234jhsdfsdffjsfg783243874jhsgf3782234682734245234324234234234234sdfsf")){
       return null; 
      }
    else{
      if(emo == "sadness"){
          this.sad.push(trans)
          this.sad_c +=1;
          this.sad_emo.push("Sad");
          // this.scripts.push(trans);
          return "Sad";
      }
    else if(emo == "happiness"){
        this.happy.push(trans);
        this.happy_c+=1;
          // this.scripts.push(trans);
        this.happy_emo.push("Happy")
      return "Happy";
    }
    else if(emo == "anger"){
      this.angry.push(trans);
      this.angry_c+=1;
          // this.scripts.push(trans);
      this.angry_emo.push("Angry");
      return "Angry";
    }
    else if(emo == "surprise"){
      this.surprise.push(trans);

          // this.scripts.push(trans);
      this.sur_c+=1;
      this.surprise_emo.push("Surprise");
      return "Surprise";
    }
    else{
      return null;
    }
    }
    
  }
  readCsvData () {
    this.http.get(this.csvUrl)
    .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
    );
  }
  private extractData(res: Response) {

    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');
    let lines = [];

    for ( let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            let tarr = [];
            for ( let j = 0; j < headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
    this.csvData = lines;
    this.emotions = [];
    this.scripts = [];
    for(var i = 0; i < this.csvData.length; i++){
       if(this.format_emotion_labels(this.csvData[i][1], this.csvData[i][3])){
           

       }
    }
    console.log("sad", this.sad.length)
    
    this.scripts = [];
    this.emotions = [];
    this.scripts.push(...this.sad.slice(0,87));
    this.emotions.push(...this.sad_emo.slice(0,87));
    this.scripts.push(...this.angry.slice(0,87));
    this.emotions.push(...this.angry_emo.slice(0,87));
    this.scripts.push(...this.happy.slice(0,52));
    this.emotions.push(...this.happy_emo.slice(0,87));
    this.scripts.push(...this.surprise.slice(0,87));
    this.emotions.push(...this.surprise_emo.slice(0,87));
    
    this.shuffle(this.scripts, this.emotions);
    this.curent_script = this.scripts[this.current_index];
    this.current_emotion = this.emotions[this.current_index];
    this.emoji = "assets/emoji/"+this.emotions[this.current_index] + ".png";
    console.log(this.emotions)
    console.log(this.scripts.length);
    console.log("Sad", this.sad_c);
    console.log("Happy", this.happy_c);
    console.log("Surprise", this.sur_c);
    console.log("Angry", this.angry_c);
    console.log(this.current_emotion, this.curent_script)
  }
  private shuffle(obj1, obj2) {
  var index = obj1.length;
  var rnd, tmp1, tmp2;

  while (index) {
    rnd = Math.floor(Math.random() * index);
    index -= 1;
    tmp1 = obj1[index];
    tmp2 = obj2[index];
    obj1[index] = obj1[rnd];
    obj2[index] = obj2[rnd];
    obj1[rnd] = tmp1;
    obj2[rnd] = tmp2;
  }
}
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return errMsg;
  }
  
  start_timer(){
    this.isTimer_started = true;
  	
  	this.timer = setInterval(this.myTimer.bind(this), 1000);
  }
  reset_timer(){
    this.isTimer_started= false;
  	clearInterval(this.timer);
  	this.hr = "00";
  	this.min = "00";
  	this.sec = "00";
  	this.hr2 = 0;
  	this.min2 = 0;
  	this.sec2 = 0;
  }

  myTimer(){
  	
  	if(this.hr2 > 24){
  		this.hr2 = 0;
  	}
  	if(this.min2 > 60){
  		this.hr2 +=1;
  		this.min2 =0;
  	}
  	if(this.sec2 > 59){
  		this.sec2 = 0;
  		this.min2 +=1;
  	}
  	this.sec2 +=1;
  	if(this.hr2 < 10){
  		this.hr = "0" + this.hr2;

  	}
  	else{
  		this.hr = this.hr2 + "";
  	}
  	if(this.min2 < 10){
  		this.min = "0" + this.min2;
  	}
  	else{
  		this.min = this.min2 + "";
  	}

  	if(this.sec2 < 10){
  		this.sec = "0" + this.sec2 ;
  	}
  	else{
  		this.sec = this.sec2 + "";
  	}
    // console.log(this.hr, this.min, this.sec)
    
  }
  
  change_format(value){
    return "0" + value;
  }

  change_font(){
  	 this.font = this.scripts_font_size + "rem";
  }
   
  start(){
      this.log = new Loger();
      // this.log.start_time = this.hr + ":" + this.min + ":" + this.sec;
      // this.log.trans = this.curent_script;
      // this.log.emotion = this.current_emotion;
      // console.log(this.log)
      this.isReacording_started = true;
  }
  finish(){
    // if(this.isReacording_started){
    //   this.log.end_time = this.hr + ":" + this.min + ":" + this.sec;
    //   console.log(this.log)
    //   this.isReacording_started = false;
    //   this.loger.push(this.log);
    // }
    
  }

  download(){
        var theJSON = JSON.stringify(this.loger);
        this.downloadJsonHref = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
        // this.downloadJsonHref = uri;
  }



  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
    	if(this.scripts.length -1 > this.current_index){
    		 this.current_index +=1;
		        this.curent_script = this.scripts[this.current_index];
		        this.current_emotion = this.emotions[this.current_index];
		        console.log("changing right", this.current_index);
		       this.emoji = "assets/emoji/"+this.emotions[this.current_index] + ".png";
           if(this.isReacording_started){
             this.finish();
           }
    	}
       
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
        if(this.current_index > 0){
        	this.current_index -=1;
        	this.curent_script = this.scripts[this.current_index];
        	this.current_emotion = this.emotions[this.current_index];
		    console.log("changing left", this.current_index);
		   this.emoji = "assets/emoji/"+this.emotions[this.current_index] + ".png";
        }
    }

    if (event.keyCode === KEY_CODE.UP_ARROW) {
        this.scripts_font_size +=0.2;
        this.change_font();

    }
    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
        this.scripts_font_size -=0.2;
        this.change_font();
    }

     if (event.keyCode === KEY_CODE.T) {
     	  this.start_timer();
     }
     if(event.keyCode === KEY_CODE.S){
     	   this.start();
     }
     if(event.keyCode === KEY_CODE.Y){
     	this.reset_timer();
     console.log(JSON.stringify(this.loger));
     }
     if(event.keyCode === KEY_CODE.D){
        this.finish();
     }
     if(event.keyCode === KEY_CODE.F){
        this.download();
     }
     if(event.keyCode === KEY_CODE.SPACE){
        this.is_shown = true;
     }
     if(event.keyCode === KEY_CODE.ENTER){
       
        if(this.clip){
          this.log = new Loger();
          this.log.clip_name = this.clip;
          this.log.trans = this.curent_script;
          this.log.emotion = this.current_emotion;
          this.loger.push(this.log);
          this.clip = "";
          this.is_shown = false;
        }
     }

  }
  onclip(value){
    console.log(value)
  }


}

export class Loger{
  public clip_name:string;
  public emotion:string;
  public trans:string
  constructor(){

  }
}
