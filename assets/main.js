$(document).ready(function(){
    
    $('body').css('overflow','hidden');
	//Window Size setting
	sizeSet();
    
    //Draggable setting
	$('.detail').draggable({
		containment:'document'
	});
	$('.item').draggable({
		//cursorAt:{top:-2,left:-2},
		containment:'document', 
		revert:true,
		stack:".board"
	});
	
	//Droppable setting
	$('.garbage, .sidebar').droppable({
		greedy: true,
		accept: ".outputItem, .inputItem",
		tolerance:"touch",
		drop:function(event, ui){
            
            var tempInID;
            var tempOutID;
           
            if($(ui.draggable).hasClass("inputItem")){
                tempInID = $(ui.draggable).attr("id");
                tempInID = tempInID.substring(5,tempInID.length);
                inputDeleteFromArray(tempInID);
            }
            
            if($(ui.draggable).hasClass("outputItem")){
                tempOutID = $(ui.draggable).attr("id");
                tempOutID = tempOutID.substring(6,tempOutID.length);
                if($(ui.draggable).parent().hasClass("inputItem")){
                    tempInID = $(ui.draggable).parent().attr("id");
                    tempInID = tempInID.substring(5,tempInID.length);
                }
            }
            
            
            
             
            if(tempInID>=0){
                if(tempOutID!=null)
                    outputOutInput(tempInID,tempOutID);
            }
			$(ui.draggable).remove();
            /*
            str="";
            for(var i=0; i<inputArr.length;i++){
                str=str+inputArr[i].getID()+"/"+inputArr[i].text+"//";
            }
            prompt(str);
            */
            
		}
	});


    $(document).on("mouseenter","[id^='input'],[id^='output']",function(){  // id가 input이나 output으로 시작하는 모든 엘리먼트들에게 mouseenter이 발생했을 때 실시간으로 draggable 속성 부여
        $(this).draggable({
            containment:'document',
            snap: $(this),
            snapMode: 'outer',
            start:function(){
                $('.garbage').animate({top: "0px"}, 175);
                $('.board').animate({top: "50px"}, 175);
            },
            drag:function(){
                if(mouseY<100){
                    $('.garbage').css({'height':50+(100-mouseY)+'px'});
                }else{
                    $('.garbage').css({'height':50+'px'});
                }
            },
            stop:function(){
                $('.garbage').animate({top: "-50px", height: "50px"}, 175);
                $('.board').animate({top: "0px"}, 175);
            },
            stack:".board"
        });
        // input Item 드롭 이벤트
        $("[id^='input']").droppable({   
            accept: '.output',
            greedy: true,
            drop:function(event,ui){
                /*
                input에 드롭되는 경우
                1. 보드 드롭 후 해당 인풋에
                2. 바로 해당 인풋에
                3. 다른 인풋에 있는 것이 해당 인풋에
                */
                var objID = $(ui.draggable).attr("id");
                outNumID = objID;       
                inNumID = $(this).attr("id");
                inNumID = inNumID.substring(5,inNumID.length);
                //아웃풋일 경우
                if($(ui.draggable).hasClass('output')){
                    //인풋에 있던 경우
                    if($(ui.draggable).hasClass('outputContain')){
                        $(ui.draggable).detach('.input').appendTo(this);
                        $('.outputContain').css({'left':0,'top':0});
                        outNumID = $(ui.draggable).attr("id");
                        outNumID = outNumID.substring(6,outNumID.length);
                        parentInNumID = $(ui.draggable).parent().attr("id");
                        parentInNumID = parentInNumID.substring(5, parentInNumID.length);
                        outputOutInput(parentInNumID, outNumID);
                    }else if($(ui.draggable).hasClass('outputItem')){ // (output drop case 3/4) = 보드에 있던 outputItem이 inputItem으로 드롭될 때
                        $(ui.draggable).addClass('outputContain').detach('.board').appendTo(this);
                        $('.outputContain').css({'left':0,'top':0});        // 알수 없는 오류로 left랑 top에 이상한 값이 들어가서 0으로 재설정함
                        outNumID = outNumID.substring(6,outNumID.length);
                    }else if(!$(ui.draggable).hasClass('outputItem')){  // (output drop case 4/4) = 아이템 리스트에 있던 output이 inputItem으로 바로 드롭될 때
                        object = createObjByID(objID);
                        object.draw();
                        outputArr[outputArr.length] = object;
                        $(document).find('#output'+object.getID()).detach().addClass('outputContain').appendTo(this);
                        outNumID = object.getID();  //실험코드
                    }
                    outputIntoInput(inNumID,outNumID);   // inputItem ID가 tempInID 인 객체에게 outputItem ID가 tempOutID인 OutputItem 을 전달
                }
            }
        });
    });

	$('.board').droppable({        // 보드 드롭 이벤트
        accept: '.item',
		greedy: true,
		drop:function(event, ui){
            var content = $(ui.draggable).text();
            var objID = $(ui.draggable).attr("id"); // drag 되는 대상(index.html의 li 엘리먼트 ID)의 id를 변수 objID에 저장
            
            if($(ui.draggable).hasClass('input')){  // item이 input일 때
                if(!$(ui.draggable).hasClass('inputItem')){ // 이미 보드에 드롭되어 있는 엘리먼트라면 또 다시 보드에 드롭되어 객체가 생성되지 못하게끔 예외로 처리
                    object = createObjByID(objID);  // createObjByID 에게 drag 되는 대상의 id를 매개변수로 넘겨주고 그 대상을 객체화 하여 object라는 변수에 저장
                    object.draw();                  // 객체를 보드 상에 그리는 함수
                    inputArr[inputArr.length] = object;  // InputItem을 저장해 놓는 배열에 생성한 InputItem 저장
                    $(document).find('#input'+object.getID()).css({'left':(mouseX-mouseBoxX)+'px', 'top':mouseY-mouseBoxY+'px'});
                }
            }else if($(ui.draggable).hasClass('output')){   // item이 output일 때
                if(!$(ui.draggable).hasClass('outputItem')){    // (output drop case 1/4) = 아이템 리스트에서 보드로 드롭
                    object = createObjByID(objID);
                    object.draw();
                    outputArr[outputArr.length] = object;
                    $(document).find('#output'+object.getID()).css({'left':(mouseX-mouseBoxX)+'px', 'top':mouseY-mouseBoxY+'px'});
                }else if($(ui.draggable).hasClass('outputContain')){   // (output drop case 2/4) = InputItem 내부의 outputItem이 보드로 드롭될 때
                    tempOutID = $(ui.draggable).attr("id");
                    tempOutID = tempOutID.substring(6,tempOutID.length);
                    tempInID = $(ui.draggable).parent().attr("id");
                    tempInID = tempInID.substring(5,tempInID.length);
                    $(ui.draggable).detach().appendTo('#draw');
                    outputOutInput(tempInID, tempOutID);
                    $(ui.draggable).removeClass('outputContain');
                    $(ui.draggable).css({'left':(mouseX)+'px', 'top':(mouseY)+'px'});
                }
            }            
        }
	});
    
    
	
	$('.process').on('click', function(){
		var $btn = $(this).button('loading');
		$btn.button('reset');
	});
	
});


