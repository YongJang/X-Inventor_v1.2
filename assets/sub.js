var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};
function sizeSet(){
    var height = $(window).height();
    var width = $(window).width();
    var colWidth = $('.col-md-2').css('width').replace(/[^-\d\.]/g, '');
    var widthG = $('.col-md-8').css('width').replace(/[^-\d\.]/g, '');
    var heightG = $('.board').css('height').replace(/[^-\d\.]/g, '');
    var drawWidth = $('.board').css('width').replace(/[^-\d\.]/g, '');
    $('.board').css({'height': height});
    $('#draw').css({'width' : drawWidth, 'height' : height});
    $('.garbage').css({'width' : widthG, 'left' : colWidth+'px'});
    $('.process').css({'top' : height-100+'px'});
    $('#simulate').css({'width' : (width/8)+20});
    $('#create').css({'width' : (width/8)+20});
    $('.detail').css({'top' : height-200+'px', 'left' : ((widthG/2)-150)+'px'});
	addEvent(window, "resize", function(event) {
		var height = $(window).height();
        var width = $(window).width();
        var colWidth = $('.col-md-2').css('width').replace(/[^-\d\.]/g, '');
        var widthG = $('.col-md-8').css('width').replace(/[^-\d\.]/g, '');
        var heightG = $('.board').css('height').replace(/[^-\d\.]/g, '');
        var drawWidth = $('.board').css('width').replace(/[^-\d\.]/g, '');
        $('.board').css({'height': height});
        $('#draw').css({'width' : drawWidth, 'height' : height});
        $('.garbage').css({'width' : widthG, 'left' : colWidth+'px'});
        $('.process').css({'top' : height-100+'px'});
        $('#simulate').css({'width' : (width/8)+20});
        $('#create').css({'width' : (width/8)+20});
        $('.detail').css({'top' : height-200+'px', 'left' : ((widthG/2)-150)+'px'});
	});
}
//////////////////////////////////////////////////////////////
function drawInput(num, text){
    return "<div id = 'input' class='inputContent "+num+"'><label id = '"+num+"'>"+text+"</label></div>";
};
function drawOutput(num, text){
    return "<div id = 'output' class='outputContent "+num+"'><label id = '"+num+"'>"+text+"</label></div>";
}
//////////////////////////////////////////////////////////////
    
///////////////////////////////////////////////////////////////
//mouse 좌표 인식 함수 // ///////////////////////////////////////
var mouseX;     //전체 document에서의 위치
var mouseY;
var mouseBoxX;  //item 박스 내에서의 위치
var mouseBoxY;

$(document).on('mousemove', '.item', function(event,position){
    mouseX = event.pageX;
    mouseY = event.pageY;

    var offset = $(this).offset();
    mouseBoxX=event.pageX-offset.left;
    mouseBoxY=event.pageY-offset.top;
});
//////////////////////////////////////////////////////////////

function outputIntoInput(inputNumber,outputNumber){
    outputObject = new Object();
    outputObject = outputArr[outputNumber];

    for(var i in inputArr[inputNumber].outputList){
        if(inputArr[inputNumber].outputList[i].getID() == outputObject.getID()){  //이미 InputItem 안에 같은 ID의 OutputItem이 있는 경우
            return;
        }
    }

    if(outputObject.inputItem.getID() != -1){
        if(outputObject.inputItem.getID() != inputArr[inputNumber].getID()){  // A라는 InputItem에 있는 OutputItem이 바로 B라는 InputItem에 드롭되는 경우
            outputOutInput(outputObject.inputItem.getID(),outputObject.getID());    // 기존의 A InputItem에서 해당되는 OutputItem 제거
        }
    }
    console.log(outputObject.inputItem);
    outputObject.inputItem = inputArr[inputNumber];
    inputArr[inputNumber].outputList[inputArr[inputNumber].outputList.length] = outputObject;

    str="";                         //실험코드
    for(var i in inputArr[inputNumber].outputList){//실험코드
        str+=inputArr[inputNumber].outputList[i].text+"/"+inputArr[inputNumber].outputList[i].getID()+"  ";//실험코드
    }                               //실험코드
    prompt(str);                    //실험코드
}
    
function outputOutInput(inputNumber,outputNumber){        
    outputObject = new OutputItem();
    outputObject = outputArr[outputNumber];
    
    for(var i in inputArr[inputNumber].outputList){
        if(inputArr[inputNumber].outputList[i].getID() == outputObject.getID()){  //이미 InputItem 안에 같은 ID의 OutputItem이 있는 경우
            inputArr[inputNumber].outputList.splice(i,1);
            return;
        }
    }
}



////////////////////////////////////////////////////////////
//detail 함수 // 데이터 저장 xxxxxx
function detailPrint(text){
    if(text === "Brightness"){
        return "<tr><th><label>| Detecting brightness</label></th><td class='selector'><select class='form-control input-lg'><option value=''></option><option value='0'>Daytime</option><option value='1'>Midnight</option><option value='2'>Night</option> 			<option value='3'>Laser</option>		      			<option value='4'>LED</option>				</select>			</td>		</tr>";
    }else if(text === "Length"){
        return "<tr><th><label>| Detecting length</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>cm</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Length Resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>cm</span>                        	    			</div>										</td>									</tr>";
    }else if(text === "Compass"){
        return "<tr><th><label>| Compass Resolution</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>º</span>                        	    			</div>										</td>									</tr>";
    }else if(text === "Heartbeat"){
        return "";
    }else if(text === "Sound"){
        return "<tr><th><label>| Detecting loudness</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>dB</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Loudness resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>dB</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Detecting frequency</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>Hz</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Detecting resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>Hz</span>                        	    			</div>										</td>									</tr>";		
    }else if(text === "Time"){
        return "<tr><th><label>| Detecting time</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>min</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Time resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>min</span>                        	    			</div>										</td>									</tr><tr>								<th class='selector2' colspan='2'>											<div class='control-group' style='text-align:center;'><label class='radio-inline'><input type='radio' name='selTime' value='0'>Current</label><label class='radio-inline'><input type='radio' name='selTime' value='1'>Custom</label>                						</div>	</th>	</tr>";
    }else if(text === "Rotation"){
        return "<tr><th><label>| Detecting angle</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>º</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Angle resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>º</span>                        	    			</div>										</td>									</tr>";
    }else if(text === "Color"){
        return "<tr><th><label>| RGB resolution</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>grd</span>                        	    			</div>										</td>									</tr>";
    }else if(text === "Acceleration"){
        return "<tr><th><label>| Detecting accel</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>g</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>g</span>                        	    			</div>										</td>									</tr>";
    }else if(text === "Slope"){
        return "<tr><th><label>| Resolution</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>º</span>                        	    			</div>										</td>									</tr>";
    }else if(text === "Humidity"){
        return "<tr><th><label>| Humidity resolution</label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>%</span>                        	    			</div>										</td>									</tr>";
    }else if(text === "Temperature"){
        return "<tr><th><label>| Thermometry range </label></th><td class='selector'><div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>~</span>                <input name='length' type='text' class='form-control' placeholder='0'>        	    <span class='input-group-addon'>ºC</span>			</div>										</td>									</tr>									<tr>										<th><label>| Resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>ºC</span>                        	    			</div>										</td>									</tr>";
    }
    else{
        return "<tr><th><label>| Detecting brightness</label></th><td class='selector'><select class='form-control input-lg'><option value=''></option><option value='0'>Daytime</option><option value='1'>Midnight</option><option value='2'>Night</option> 			<option value='3'>Laser</option>		      			<option value='4'>LED</option>				</select>			</td>		</tr>";
    }
}
function detailOutPrint(text){
    if(text === " Movement"){
        return "<tr>										<th><label>| Movement type</label></th>										<td class='selector'>											<select class='form-control input-lg' id='sel'>												<option value=''></option>                   				        		<option value='R'>Rotating</option>                   				      			<option value='L'>Linear</option>                   				      			<option value='A'>Angle</option>											</select>										</td>									</tr>";
    }else if(text === " Light"){
        return "<tr>										<th><label>| Actuating light</label></th>										<td class='selector'>											<select class='form-control input-lg'>												<option value='></option>                   				        		<option value='0'>Bulb</option>                   				      			<option value='1'>Candle</option>                   				      			<option value='2'>Halogen</option>                   				      			<option value='3'>Neon</option>                   				      			<option value='4'>Lamp</option>                   				      			<option value='5'>Lighter</option>											</select>										</td>									</tr>";
    }else if(text === " Speaker"){
        return "<tr>										<th><label>| Actuating loudness</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>dB</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Loudness resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>dB</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Actuating frequency</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>Hz</span>                        	    			</div>										</td>									</tr>									<tr>										<th><label>| Frequency resolution</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>Hz</span>                        	    			</div>										</td>									</tr>";
    }else if(text === " Vibration"){
        return "<tr>										<th><label>| Intensity</label></th>										<td class='selector'>											<select class='form-control input-lg'>                   				        		<option value='0'>High</option>                   				      			<option value='1'>Middle</option>                   				      			<option value='2'>Low</option>											</select>										</td>									</tr>";
    }else if(text === " Save Data"){
        return "<tr>										<th><label>| Data type</label></th>										<td class='selector'>											<select class='form-control input-lg'>                   				        		<option value='0'>txt</option>                   				      			<option value='1'>Excel</option>                   				      			<option value='2'>Image</option>                   				      			<option value='3'>Video</option>											</select>										</td>									</tr>";
    }else if(text === " H A"){
        return "";
    }else if(text === " Waterpump"){
        return "<tr>										<th><label>| Flow</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>㎖/s</span>                        	    			</div>										</td>									</tr>";
    }else if(text === " Display"){
        return "<tr>										<th><label>| Display type</label></th>										<td class='selector'>											<select class='form-control input-lg'>                   				        		<option value='0'>Text</option>                   				      			<option value='1'>Image</option>                   				      			<option value='2'>Video</option>											</select>										</td>									</tr>";
    }else if(text === " Heater"){
        return "<tr>										<th><label>| Actuating temperature</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>~</span>              <input name='length' type='text' class='form-control' placeholder='0'>          	<span class='input-group-addon'>ºC</span>    			</div>										</td>									</tr>									<tr>										<th><label>| Heat power</label></th>										<td class='selector'>											<div class='input-group input-group-lg'>											<input name='length' type='text' class='form-control' placeholder='0'>                        	    			<span class='input-group-addon'>W</span>                        	    			</div>										</td>									</tr>";
    }
    else{
        return "<tr>										<th><label>| Movement type</label></th>										<td class='selector'>											<select class='form-control input-lg' id='sel'>												<option value=''></option>                   				        		<option value='R'>Rotating</option>                   				      			<option value='L'>Linear</option>                   				      			<option value='A'>Angle</option>											</select>										</td>									</tr>";
    }
}

inputNum = 0;   //input+inputNum = input객체의 ID
outputNum = 0;  //output+outputNum = output객체의 ID

// ID 값을 매개변수로 받으면 오브젝트를 생성하는 함수
function createObjByID(ID){	//
    var object;
    select = $(document).find('#'+ID);
    if(select.hasClass('item')){	// item이 맞는지 확인

        if(select.hasClass('input')){	// input Item 생성

            if(ID == "I0"){		// Brightness
                Brightness.prototype = new InputItem();
                object = new Brightness();
            }else if(ID == "I1"){		// Length
                Length.prototype = new InputItem();
                object = new Length();
            }else if(ID == "I2"){
                Compass.prototype = new InputItem();
                object = new Compass();
            }else if(ID == "I3"){
                Heartbeat.prototype = new InputItem();
                object = new Heartbeat();
            }else if(ID == "I4"){
                Sound.prototype = new InputItem();
                object = new Sound();
            }else if(ID == "I5"){
                Time.prototype = new InputItem();
                object = new Time();
            }else if(ID == "I6"){
                Rotation.prototype = new InputItem();
                object = new Rotation();
            }else if(ID == "I7"){
                Color.prototype = new InputItem();
                object = new Color();
            }else if(ID == "I8"){
                Acceleration.prototype = new InputItem();
                object = new Acceleration();
            }else if(ID == "I9"){
                Slope.prototype = new InputItem();
                object = new Slope();
            }else if(ID == "I10"){
                Humidity.prototype = new InputItem();
                object = new Humidity();
            }else{
                Temperature.prototype = new InputItem();
                object = new Temperature();
            }
            object.setID(inputNum++);
        }else{	// output Item 생성
            if(ID == "O0"){
                Speaker.prototype = new OutputItem();
                object = new Speaker();
            }else if(ID == "O1"){
                Movement.prototype = new OutputItem();
                object = new Movement();
            }else if(ID == "O2"){
                Light.prototype = new OutputItem();
                object = new Light();
            }else if(ID == "O3"){
                Vibration.prototype = new OutputItem();
                object = new Vibration();
            }else if(ID == "O4"){
                SaveData.prototype = new OutputItem();
                object = new SaveData();
            }else if(ID == "O5"){
                HA.prototype = new OutputItem();
                object = new HA();
            }else if(ID == "O6"){
                Waterpump.prototype = new OutputItem();
                object = new Waterpump();
            }else if(ID == "O7"){
                Display.prototype = new OutputItem();
                object = new Display();
            }else{
                Heater.prototype = new OutputItem();
                object = new Heater();
            }
            object.setID(outputNum++);
        }
    }else{return ""}	// error
    return object;
}

///////////////////////객체 정보///////////////////////////////////
/////////////////////////부모 클래스///////////////////////////////
//id가 -1이면 생성이 안되었다는 뜻.
function InputItem(){
        this.id=-1;
        this.text="default";
        this.getID = function(){
            return this.id;
        };
        this.setID = function(id){
            this.id = id;
        };
        this.outputList = new Array();
        this.draw = function(){
             $("#draw").append("<div id = 'input"+this.id+"'  class='item intput inputItem'><label>"+this.text+"</label></div>");
        };
	};
	
	function OutputItem(){
		this.inputItem = new InputItem();
		this.id=-1;
        this.text="default";
		this.getID = function(){
			return this.id;
		};
		this.setID = function(id){
			this.id = id;
		};
		this.savedClass; 
        this.draw = function(){
                $("#draw").append("<div id = 'output"+this.id+"'  class='item output outputItem'><label>"+this.text+"</label></div>");
        };
	};

inputArr = new Array(); // InputItem 클래스들을 저장할 배열
outputArr = new Array();    // OutputItem 클래스들을 저장할 배열
	
///////////////////////////INPUT///////////////////////////////////
	function Brightness(){
		this.detectingBrightness = "Daytime";
        this.text = "Brightness";
	};
	
	function Length(){
		this.detectingLength = 0;	//default setting
		this.selectedLengthUnit = "mm";	//default setting
		this.resolution = 0;	//default setting
		this.selectedResolutionUnit = "default";
		this.text = "Length";
	};
	
	function Compass(){
		this.text = "Compass";
	};
	
	function Heartbeat(){
		this.text = "Heartbeat";
	};
	
	function Sound(){
		this.text = "Sound";
	};
	
	function Time(){
		this.text = "Time";
	};
	
	function Rotation(){
		this.text = "Rotation";
	};
	function Color(){
		this.text = "Color";
	};
	function Slope(){
		this.text = "Slope";
	};
	function Acceleration(){
		this.text = "Acceleration";
	};
	function Humidity(){
		this.text = "Humidity";
	};
	function Temperature(){
		this.text = "Temperature";
	};
	///////////////////////////////////////OUTPUT/////////////////////////////////////////
	function Speaker(){
		this.text = "Speaker"
	};
	function Movement(){
		this.text = "Movement"
	};
	function Light(){
        this.text = "Light"
    };
	function Vibration(){
        this.text = "Vibration"
    };
	function SaveData(){
        this.text = "SaveData"
    };
	function HA(){
        this.text = "HA"
    };
	function Waterpump(){
        this.text = "Waterpump"
    };
	function Display(){
        this.text = "Display"
    };
	function Heater(){
        this.text = "Heater"
    };
//////////////////////////////////////////////////////////////////////////////////////////
