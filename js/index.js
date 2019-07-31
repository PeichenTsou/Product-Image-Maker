// <!-- Configure a few settings and attach camera -->
Webcam.set({
  // width: 780, // phone camera quality
  // height: 1280,
  width: 320, // Computer camera quality
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

///Change HTML to picture file  ((Loop ver.))
$("#changeToPic").click(function() {
  for(var i = 0; i < $(".iWantCapture").length; i++){
    console.log("Change HTML to picture"+i);

    html2canvas($(".iWantCapture")[i], {scale:1,allowTaint:true})
      .then(function(canvas){
        var $div = $("fieldset div"); //div inside fieldset
        var $canvas = canvas;

        console.log("$canvas = canvas"+$canvas.toDataURL("image/png"));
        $("<img />", { src: $canvas.toDataURL("image/png") }).appendTo($div);          
        var url = $canvas.toDataURL("image/png");
    
        //Adding URL into Array
        mydata.downloadLinks.length = 0;
        mydata.downloadLinks.push(canvas.toDataURL("image/png"));
        
        var link = $("<a href='#' download='dl.png' class='oneDownloadLink'>Download one picture</a>").attr('href', mydata.downloadLinks[0]);
        $("fieldset div").append(link);
      });
  }
});


//Get Date value
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
    $("#after").remove(); //Delete ATER↑ But can't delete #priceDiv
    
    //Calculate the price in NT$
    var after_price = 0.027*parseInt(mydata.originalPrice)+parseInt(mydata.weight)*parseInt(mydata.delivery_Per1kg_NT)+parseInt(mydata.adjust);
    var current_total_html= total_html.replace("{{priceAfterCalc}}",after_price);
    $(".priceDiv").append(current_total_html);

    //Get datepicker value and put the date into it
    mydata.dueDate = $("#datepicker").val();

    //Show the watermark http://www.cnblogs.com/smallmuda/archive/2010/11/30/1892384.html
    $(".waterimg").css('display','block');
  }    
);

///Data selection
$(function() {
  $("#datepicker").datepicker();
  $("#anim").change(function() {
    $("#datepicker").datepicker("option", "showAnim", $( this ).val());
  });
  
  //Set default date and format　http://hant.ask.helplib.com/jquery-ui/post_970654
  $("#datepicker").datepicker("option","dateFormat","yy/mm/dd");
  $('#datepicker').datepicker('setDate', new Date());
});

var vm=new Vue({
  el: "body",
  data: mydata
});

/////Previewing multiple pictures uploaded
$("#progressbarTWInput").change(function(){
  $("#preview_progressbarTW_imgs").html(""); // clear the preview
  readURL(this);
});

function readURL(input) {
  if (input.files && input.files.length >= 0) {
    for(var i = 0; i < input.files.length; i++) {
      console.log(i);
     
      var reader = new FileReader();
      reader.onload = function (e) {
        console.log("function (e)" + i); //test
        
        ///Add the info
        var info_html="<div class='iWantCapture' id='app2'><div class='waterimg'>浮水印字樣</div><div  id='results2' class='scrshot2'><img src='{{imgsrc}}' height='100px'/></div><table><tr><td>{{productName}}</td></tr><tr><td><div class='priceDiv2'>NT${{priceAfterCalc}}</div></td></tr><tr><td>【Due Date: {{dueDate}}, {{dueTime}}】</div></td></tr></table></div>";
        
        //Calculate price in NT$
        var after_price = 0.027 * parseInt(mydata.originalPrice) + parseInt(mydata.weight) * parseInt(mydata.delivery_Per1kg_NT) + parseInt(mydata.adjust);
        var new_htm2= info_html.replace("{{imgsrc}}",e.target.result)
          .replace("{{productName}}",mydata.productName)
          .replace("{{dueDate}}",$("#datepicker").val())
          .replace("{{dueTime}}",mydata.dueTime)
          .replace("{{priceAfterCalc}}",after_price);

        $("#preview_progressbarTW_imgs").append(new_htm2);
        
         //Show the watermark
        $(".waterimg").css('display','block');
      }

      console.log("reader"+i);
      reader.readAsDataURL(input.files[i]);
    }
  }else{
     var noPictures = $("<p>There is no pictures now.</p>");
     $("#preview_progressbarTW_imgs").append(noPictures);
  }
}