

var disMovie=document.getElementById('disMovie');
var disDate=document.getElementById('disDate');
var roomName='Puru';


if(localStorage.getItem('localData')!=null){

	var jsonStr=localStorage.getItem('localData');
}else{

	var jsonStr="[{'movieName':'movieName','dateTime':'dateTime','roomName':'roomName','seats':['1','2']}]";
}
var jsonarr=eval('('+jsonStr+')');


getParam();
var movieName;
var dateTime;
function getParam(){
	var url=window.location.href;
	var result = url.split("?")[1];
	var keyValue = result.split("&");
	var results=[];
	for (var i = 0; i < keyValue.length; i++) {
		var item = keyValue[i].split("=");
		results[i]=item[1];
	}
	results[0]=results[0].replace(/%20/g," ");
	movieName=results[0];
	dateTime=" "+results[1]+" "+results[2];
	disMovie.innerHTML=" "+results[0];
	disDate.innerHTML=" "+results[1]+" "+results[2];
}

var rowcolPuru=loadSeats(x, seatsPuru);//get Puru from xml and get rows and cols of Puru
creatRoom('tablePuru',seatsPuru,'seatsPuru',rowcolPuru[0],rowcolPuru[1]);
var rowcolWhero=loadSeats(y, seatsWhero);//get Whero from xml and get rows and cols of Whero
creatRoom('tableWhero',seatsWhero,'seatsWhero',rowcolWhero[0],rowcolWhero[1]);
getStorageDate();

function loadSeats(currentTag, arraySeats){//get seats from xml
	var cols=1;
	var rows=0;
	for(i=0;i<currentTag.length;i++){
		room = currentTag[i].getElementsByTagName("Room")[0].childNodes[0].nodeValue;
		row=currentTag[i].getElementsByTagName("Row")[0].childNodes[0].nodeValue;
		column=currentTag[i].getElementsByTagName("Column")[0].childNodes[0].nodeValue;
		price=currentTag[i].getElementsByTagName("Price")[0].childNodes[0].nodeValue;
		condition=currentTag[i].getElementsByTagName("Status")[0].childNodes[0].nodeValue;
		var currentSeat=new seat(room, row, column, price, condition);
		arraySeats.push(currentSeat);
		if(row=='A'){
			cols++;
		}
		if(i==currentTag.length-1){
			rows=getRows(row);
		}
	}
	var results=new Array(rows,cols);
	return results;
}



function creatRoom(tableName,seats,idName,rows,cols){//creat table 
	var table = document.createElement("table");
    table.setAttribute("id", tableName);
	if(tableName=="tableWhero"){
		table.setAttribute("style", "display:none");
	}
	var flag=0;
	
	for(i=0;i<rows;i++){
		var currentRow=table.insertRow(i);
		var currentCells=[];
		
		for(j=0;j<cols;j++){
			
			var span=document.createElement("span");
			currentCells.push(currentRow.insertCell(j));
			printRow(i,currentCells);
			if(flag<seats.length&&j!=0){
				seatClass(currentCells,j,seats[flag].condition);
				currentCells[j].setAttribute('seatNumber', seats[flag].row + seats[flag].column);
				currentCells[j].setAttribute('seatStatus', seats[flag].condition);
				currentCells[j].setAttribute('roomName', seats[flag].room);
				currentCells[j].setAttribute('style', "position:relative");
				currentCells[j].setAttribute('seatPrice', seats[flag].price);
				currentCells[j].setAttribute('id', seats[flag].room+seats[flag].row + seats[flag].column);
				//currentCells[j].innerHTML = seats[flag].row + seats[flag].column;
				currentCells[j].innerHTML = " ";
				if(seats[flag].condition!=-1)
				{
					span.setAttribute('style', "position:absolute");
					span.setAttribute('class', "innerSpan");
					span.innerHTML=seats[flag].row + seats[flag].column+" $"+seats[flag].price;
					currentCells[j].appendChild(span);
				}
				flag++;
			 }
		}
	}
	document.getElementById(idName).appendChild(table);
}

function seatClass(currentCells,j,condition){//get the status of seat
	switch (condition){
		case '-1':
			currentCells[j].setAttribute('class','noSeat');
		break;
		case '0':
			currentCells[j].setAttribute('class','showSeat');
			currentCells[j].setAttribute('onClick','seatSelect(this)');
		break;
		case '1':
			currentCells[j].setAttribute('class','bookedSeat');
		break;
	}
}
var tickets=0;
var allSelectedSearts=[];//selected seats
var showSeats=document.getElementById('disSeats');
function seatSelect(cell){//change the style of selecting and cancling seats
		var currentClass=cell.getAttribute('class');
		//roomName=cell.getAttribute('roomName');
		if(allSelectedSearts.length==0){
			document.getElementById('disSeats').innerHTML='';
			document.getElementById('bookInfo').innerHTML='';
		}
		if(currentClass=="showSeat"){
			if(tickets>=6){
				alert("One order maximum can book 6 tickets!");
			}else{
				cell.setAttribute('class','selectSeat');
				tickets++;
				getValues(cell,1);	
			}
			allSelectedSearts.push(cell.id);
		}
		if(currentClass=="selectSeat"){
			cell.setAttribute('class','showSeat');
			tickets--;
			getValues(cell,0);
			if(tickets==0){
				showSeats.style.borderColor="white";
			}
			var index = allSelectedSearts.indexOf(cell.id); 
			if (index > -1) { 
				allSelectedSearts.splice(index, 1); 
			} 

		}
	
}

var totalPrice=0;//price 
var showPrice=document.getElementById('disPrice');
var showTickets=document.getElementById('disTickets');
function getValues(cell,count){//set values for price and seats number
	if(count==1){
		var li= document.createElement("li");
		totalPrice+=parseInt(cell.getAttribute('seatPrice'));
		li.innerHTML=cell.getAttribute('seatNumber')+' $'+cell.getAttribute('seatPrice');
		li.setAttribute("id",cell.getAttribute('seatNumber'));
		showSeats.appendChild(li);
		showSeats.style.borderColor="orange";

	}else{
		totalPrice-=cell.getAttribute('seatPrice');
		var deletli=document.getElementById(cell.getAttribute('seatNumber'));
		showSeats.removeChild(deletli);
	}	
	showPrice.innerHTML=' $ '+totalPrice;
	showTickets.innerHTML=" "+tickets;
	
}

function showRoom(elem){//change room, clear price and seats number, refresh room
	var idName=elem.getAttribute('id');
	var currentRoom=document.getElementById('disRoom');
	document.getElementById('bookInfo').innerHTML='';
	document.getElementById('disSeats').innerHTML='';
	document.getElementById('disPrice').innerHTML=' $ 0';
	document.getElementById('disTickets').innerHTML=' 0';
	allSelectedSearts=[];
	showSeats.style.borderColor="white";
	tickets=0;
	totalPrice=0;
	disNumber='';
	var infoSeat=document.getElementById('disSeats');
	if(idName=="roomPuru"){
		roomName='Puru';
		document.getElementById('seatsWhero').innerHTML = "";
		creatRoom('tableWhero',seatsWhero,'seatsWhero',rowcolWhero[0],rowcolWhero[1]);
		getStorageDate();
		document.getElementById('tablePuru').style.display='';
		document.getElementById('tableWhero').style.display="none";
		document.getElementById('roomPuru').style.background="url(../images/bg_currentroom.jpg)";
		document.getElementById('roomPuru').style.color="white"
		document.getElementById('roomWhero').style.background="white";
		document.getElementById('roomWhero').style.color="black"
		currentRoom.innerHTML=" Puru room";
		
	}
	if(idName=="roomWhero"){
		roomName='Whero';
		document.getElementById('seatsPuru').innerHTML = "";
		creatRoom('tablePuru',seatsPuru,'seatsPuru',rowcolPuru[0],rowcolPuru[1]);
		getStorageDate();
		document.getElementById('tablePuru').style.display="none";
		document.getElementById('tableWhero').style.display='';
		document.getElementById('roomPuru').style.background="white";
		document.getElementById('roomPuru').style.color="black"
		document.getElementById('roomWhero').style.background="url(../images/bg_currentroom.jpg)";
		document.getElementById('roomWhero').style.color="white"
		currentRoom.innerHTML=" Whero room";
	}
}
function bookConfirmation(){
	var disAll='';
	if(allSelectedSearts.length==0){
		alert("Please select at least one seat!");
	}else{
		var seatInfo='';
		for (var i = 0; i < allSelectedSearts.length; i++) { 
			document.getElementById(allSelectedSearts[i]).setAttribute('class','bookedSeat');
			if(roomName=="Puru"){
				allSelectedSearts[i]=allSelectedSearts[i].replace("Puru","");
				seatInfo+=allSelectedSearts[i]+',';
			}else{
				allSelectedSearts[i]=allSelectedSearts[i].replace("Whero","");
				seatInfo+=allSelectedSearts[i]+',';
			}
		}
		var bookInfo=document.getElementById("bookInfo");
		seatInfo=seatInfo.substr(0,seatInfo.length-1);
		disAll+="Movie: "+movieName;
		disAll+="<br/>Date: "+dateTime;
		disAll+="<br/>Room: "+roomName;
		disAll+="<br/>Seats: "+seatInfo+"<br/> Tickets: "+tickets+"<br/> TotalPrice: $ "+totalPrice;
		bookInfo.innerHTML=disAll;
		tickets=0;
		totalPrice=0;
		allSelectedSearts=[];
		var jsonNew={
		'movieName':movieName,
		'dateTime':dateTime,
		'roomName':roomName,
		'seats':[]
		}
		var seatSplit=seatInfo.split(',');
		for(i=0;i<seatSplit.length;i++){
			jsonNew.seats[jsonNew.seats.length]=seatSplit[i];
		}
		jsonarr.push(jsonNew);
		var str_jsonData = JSON.stringify(jsonarr); 
		localStorage.setItem('localData', str_jsonData);
	}
	
	
}
function getStorageDate(){
	var getLocalDate = localStorage.getItem('localData');
	if(getLocalDate!=null){
		var jsonObh = eval('(' + getLocalDate + ')');
		for(var i=0;i<jsonObh.length;i++){
			if(jsonObh[i].movieName==movieName&&jsonObh[i].dateTime==dateTime&&jsonObh[i].roomName==roomName){
				for(var j=0;j<jsonObh[i].seats.length;j++)
				{
					var currentID=jsonObh[i].roomName+jsonObh[i].seats[j];
					var currentElem=document.getElementById(currentID);
					currentElem.setAttribute('class','bookedSeat');
				}
			}

		}
	}
	
}
function printRow(i,currentCells){//print row
	switch (i){
				case 0:
					currentCells[0].innerHTML='A';
				break;
				case 1:
					currentCells[0].innerHTML='B';
				break;
				case 2:
					currentCells[0].innerHTML='C';
				break;
				case 3:
					currentCells[0].innerHTML='D';
				break;
				case 4:
					currentCells[0].innerHTML='E';
				break;
				case 5:
					currentCells[0].innerHTML='F';
				break;
				case 6:
					currentCells[0].innerHTML='G';
				break;
				case 7:
					currentCells[0].innerHTML='H';
				break;
				case 8:
					currentCells[0].innerHTML='I';
				break;
				case 9:
					currentCells[0].innerHTML='J';
				break;
				case 10:
					currentCells[0].innerHTML='K';
				break;
			}
			
}
function getRows(row){//get rows
	switch (row){
		case 'A':
			return 1;
		break;
	}
	switch (row){
		case 'B':
			return 2;
		break;
	}
	switch (row){
		case 'C':
			return 3;
		break;
	}
	switch (row){
		case 'D':
			return 4;
		break;
	}
	switch (row){
		case 'E':
			return 5;
		break;
	}
	switch (row){
		case 'F':
			return 6;
		break;
	}
	switch (row){
		case 'G':
			return 7;
		break;
	}
	switch (row){
		case 'H':
			return 8;
		break;
	}
	switch (row){
		case 'I':
			return 9;
		break;
	}
	switch (row){
		case 'J':
			return 10;
		break;
	}
	switch (row){
		case 'K':
			return 11;
		break;
	}
}