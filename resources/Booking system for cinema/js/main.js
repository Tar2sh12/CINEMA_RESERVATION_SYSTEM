function switchBackground(index){//change the background of li
	var lis=document.getElementById("nav").getElementsByTagName("li");
	for(i=0;i<lis.length;i++){
		if(i==index){
			lis[i].setAttribute("class","lichoosed");
		}else{
			lis[i].setAttribute("class"," ");
		}
	}
}