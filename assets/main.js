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
    
/*    function drawDiv(content){
         $('#draw').append(drawInput(++sel, content));
    }*/
    $(document).on("mouseover","[id^='input']",function(){  // id가 input으로 시작하는 모든 엘리먼트들에게 mouseover이 발생했을 때 실시간으로 draggable 속성 부여
        $(this).draggable({
            containment : 'document'
        });
    });
    
	$('.board').droppable({
		greedy: true,
		drop:function(event, ui){
            var content = $(ui.draggable).text();
            var objID = $(ui.draggable).attr("id"); // drag 되는 대상(index.html의 li 엘리먼트 ID)의 id를 변수 objID에 저장
            if(!$(ui.draggable).hasClass('inputItem')){ // 이미 보드에 드롭되어 있는 엘리먼트라면 또 다시 보드에 드롭되어 객체가 생성되지 못하게끔 예외로 처리
                object = createObjByID(objID);  // createObjByID 에게 drag 되는 대상의 id를 매개변수로 넘겨주고 그 대상을 객체화 하여 object라는 변수에 저장
                object.draw();                  // 객체를 보드 상에 그리는 함수
            }
            
            var num = $('.inputContent').children('label').attr('id');
            if(num === String(sel)){
                $('.inputContent > .'+sel).draggable({
                    containment:'document',
                    revert:true,
                    start:function(){
                        $('.garbage').animate({
                            top: "0px"
                        }, 175);
                        $('.board').animate({
                            top: "50px"
                        }, 175);
                    },
                    drag:function(){
                        mouseY = event.pageY;//-offset.top;
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
            }
        }
	});
	
	$('.process').on('click', function(){
		var $btn = $(this).button('loading');
		$btn.button('reset');
	});
	
});


