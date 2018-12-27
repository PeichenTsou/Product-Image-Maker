// <!-- Configure a few settings and attach camera -->
Webcam.set({
  // width: 780, //手機版才有的畫質
  // height: 1280,
  width: 320, //電腦版測試用
  height: 640,
  image_format: 'png',
  // jpeg_quality: 90
  dpi: 300,
  scale: 2
});
Webcam.attach('#my_camera');

// <!-- Code to handle taking the snapshot and displaying it locally -->
function take_snapshot() {
  // take snapshot and get image data
  Webcam.snap( function(data_uri) {
    // display results in page
    document.getElementById('results').innerHTML = 
    '<img src="'+data_uri+'" height="180" width="180"/>';
  });
}

///HTML轉為圖檔 ((迴圈版))
$("#changeToPic").click(function() {
  for(var i = 0; i < $(".iWantCapture").length; i++){
    console.log("HTML轉為圖檔"+i);
  
    html2canvas($(".iWantCapture")[i], {scale:2,allowTaint:true})
      .then(function(canvas){
        var $div = $("fieldset div"); //fieldset裡面的div
        var $canvas = canvas;
    
        console.log("$canvas = canvas"+$canvas.toDataURL("image/png"));
        $("<img />", { src: $canvas.toDataURL("image/png") }).appendTo($div);          
        var url = $canvas.toDataURL("image/png");
    
        //把網址加到陣列
        mydata.downloadLinks.length = 0;
        mydata.downloadLinks.push(canvas.toDataURL("image/png"));
        
        var link = $("<a href='#' download='dl.png' class='oneDownloadLink'>單張下載</a>").attr('href', mydata.downloadLinks[0]);
        $("fieldset div").append(link);
      });
  }
});

//一次下載多張
$('#downloadMany2').click(function() {
  $('.oneDownloadLink').click()
  console.log("downloadMany"+1);
});

//取日期的值
var date = $("#datepicker").val();

var mydata={
  productName: "Nature republic",
  originalPrice: "5000",
  priceAfterCalc: "390",
  weight: "3.5",
  delivery_Per1kg_NT: "100",
  adjust: "0",
  rate: "0.027",
  dueDate: "",
  dueTime: "2PM",
  downloadLinks: ["1","2","3"]
};

$(".culcu_btn").click(
  function calcuPrice() {
    console.log(1);
    var total_html="<div id='after'>NT${{priceAfterCalc}}</div>";
    $("#after").remove(); //刪除ATER↑不能刪除#priceDiv
    
    //計算台幣價格
    var after_price = 0.027*parseInt(mydata.originalPrice)+parseInt(mydata.weight)*parseInt(mydata.delivery_Per1kg_NT)+parseInt(mydata.adjust);
    var current_total_html= total_html.replace("{{priceAfterCalc}}",after_price);
    $(".priceDiv").append(current_total_html);

    //取datepicker值把日期放進去
    mydata.dueDate = $("#datepicker").val()

    //讓浮水印圖片出現 http://www.cnblogs.com/smallmuda/archive/2010/11/30/1892384.html
    $(".waterimg").css('display','block');
  }    
);

///日期選擇
$(function() {
  $("#datepicker").datepicker();
  $("#anim").change(function() {
    $("#datepicker").datepicker("option", "showAnim", $( this ).val());
  });
  
  //設定默認日期與格式　http://hant.ask.helplib.com/jquery-ui/post_970654
  $("#datepicker").datepicker("option","dateFormat","yy/mm/dd");
  $('#datepicker').datepicker('setDate', new Date());
});

var vm=new Vue({
  el: "body",
  data: mydata
});

/////上傳多個圖片預覽
$("#progressbarTWInput").change(function(){
  $("#preview_progressbarTW_imgs").html(""); // 清除預覽
  readURL(this);
});

function readURL(input) {
  if (input.files && input.files.length >= 0) {
    for(var i = 0; i < input.files.length; i++) {
      console.log(i);
     
      var reader = new FileReader();
      reader.onload = function (e) {
        console.log("function (e)" + i); //test
        
        ///把資訊加上去
        var info_html="<div class='iWantCapture' id='app2'><div class='waterimg'>浮水印字樣</div><div  id='results2' class='scrshot2'><img src='{{imgsrc}}' height='100px'/></div><table><tr><td>{{productName}}</td></tr><tr><td><div class='priceDiv2'>NT${{priceAfterCalc}}</div></td></tr><tr><td>【收單時間{{dueDate}}, {{dueTime}}】</div></td></tr></table></div>";
        
        //計算台幣價格
        var after_price = 0.027 * parseInt(mydata.originalPrice) + parseInt(mydata.weight) * parseInt(mydata.delivery_Per1kg_NT) + parseInt(mydata.adjust);
        var new_htm2= info_html.replace("{{imgsrc}}",e.target.result)
          .replace("{{productName}}",mydata.productName)
          .replace("{{dueDate}}",$("#datepicker").val())
          .replace("{{dueTime}}",mydata.dueTime)
          .replace("{{priceAfterCalc}}",after_price);

        $("#preview_progressbarTW_imgs").append(new_htm2);
        
         //讓浮水印圖片出現
        $(".waterimg").css('display','block');
      }

      console.log("reader"+i);
      reader.readAsDataURL(input.files[i]);
    }
  }else{
     var noPictures = $("<p>目前沒有圖片</p>");
     $("#preview_progressbarTW_imgs").append(noPictures);
  }
}