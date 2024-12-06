var currentDate=document.getElementById('userDate');
var currentTime=document.getElementById('userTime');
function currentSelect(ele){
	if(currentDate.value!=''){//make sure the date is not empty
		var chooseDate=currentDate.value;
		var choosewholeDate=chooseDate.split('-');
		//choose year month day
		var chooseYear=parseInt(choosewholeDate[0]);
		var chooseMonth=parseInt(choosewholeDate[1]);
		var chooseDate=parseInt(choosewholeDate[2]);

		var curDate=new Date();
		//current year month day
		var nowYear=curDate.getYear()+1900;
		var nowMonth=curDate.getMonth()+1;
		var nowday=curDate.getDate();
		//make sure this is a valid date
		if(chooseYear<nowYear)
		{
			alert("Sorry, you cannot select a past date!");
		}
		else
		{
			if(chooseMonth<nowMonth)
			{
				alert("Sorry, you cannot select a past date!");
			}
			else if(chooseMonth==nowMonth)
			{
				if(chooseDate<nowday)
				{
					alert("Sorry, you cannot select a past date!");
				}
				else
				{
					ele.children[0].href="seatsRoom.html?movie="+ele.title+"&date="+currentDate.value+"&time="+currentTime.value;
				}
			}
			else
			{
	

				ele.children[0].href="seatsRoom.html?movie="+ele.title+"&date="+currentDate.value+"&time="+currentTime.value;

			}
			
		}
		
	}else{
		alert('Please choose a date!');
		ele.children[0].href="";
		
	}
	
}
