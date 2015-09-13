$(document).ready(function(){

    var sel=0;
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
			$(ui.draggable).remove();			
		}
	});


    $(document).on("mouseover","[id^='input'],[id^='output']",function(){  // id가 input으로 시작하는 모든 엘리먼트들에게 mouseover이 발생했을 때 실시간으로 draggable 속성 부여
        $(this).draggable({
            containment:'document',
            snap: $(this),
            start:function(){
                $('.garbage').animate({
                    top: "0px"
                }, 175);
                $('.board').animate({
                    top: "50px"
                }, 175);
            },
            drag:function(){
                if(mouseY<100){
                    $('.garbage').css({'height':50+(100-mouseY)+'px'});
                }else{
                    $('.garbage').css({'height':50+'px'});
                }
            },
            stop:function(){
                $('.garbage').animate({
                    top: "-50px",
                    height: "50px"
                }, 175);
                $('.board').animate({
                    top: "0px"
                }, 175);
            },
            stack:".board"
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
                    inputArr[object.getID()] = object;  // InputItem을 저장해 놓는 배열에 생성한 InputItem 저장
                    $(document).find('#input'+object.getID()).css({'left':(mouseX-mouseBoxX)+'px', 'top':mouseY-mouseBoxY+'px'});
                }
            }else if($(ui.draggable).hasClass('output')){   // item이 output일 때
                if(!$(ui.draggable).hasClass('outputItem')){    // (output drop case 1/4) = 아이템 리스트에서 보드로 드롭
                    object = createObjByID(objID);
                    object.draw();
                    $(document).find('#output'+object.getID()).css({'left':(mouseX-mouseBoxX)+'px', 'top':mouseY-mouseBoxY+'px'});
                }else if($(ui.draggable).hasClass('outputContain')){   // (output drop case 2/4) = InputItem 내부의 outputItem이 보드로 드롭될 때
                    $(ui.draggable).detach().css({'left':(mouseX-mouseBoxX)+'px', 'top':mouseY-mouseBoxY+'px'}).appendTo(this);
                    $(ui.draggable).removeClass('outputContain');
                }
            }
            
        }
	});
	
	$('.process').on('click', function(){
		var $btn = $(this).button('loading');
		$btn.button('reset');
	});
	
});


