CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

function d(i) {
  return document.getElementById(i);
}

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function loopject(o, doo) {
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      doo(key, o[key]);
    }
  }
}

function filer(dox) {
  d('f').addEventListener('change', function () {
    var files = d('f').files;
    var files_text = {};
    var files_image = {};
    var files_audio = {};
    for (var i = 0; i < files.length; i++) {
      if (/text/.test(files[i].type)) {
        var fname = files[i].name.replace(/\.[^/.]+$/, '');

        files_text[fname] = files[i];
      }

      if (/image/.test(files[i].type)) {
        var fname = files[i].name.replace(/\.[^/.]+$/, '');

        files_image[fname] = files[i];
      }


      if (/.mp3/.test(files[i].name)) {
        var fname = files[i].name.replace(/\.[^/.]+$/, '');
        files_audio[fname] = files[i];


      }
    }

    loopject(files_text, (k, val) => {
      if (typeof files_image[k] != 'undefined') {
        dox(k,files_text[k], files_image[k], files_audio[k]);
      }
    });
  });
}

function gen_old(val) {
  val = val.replaceAll('\r', '');
  const regexpSize = /^(.*?)\n(.*?)\n\n/gms;
  var vals = [];

  val.match(regexpSize).forEach((v) => {
    var xpl = v.trim().split('\n');
    var title = xpl[0];
    var more = [];
    xpl.forEach((vv, i) => {
      if (i > 0) {
        more.push(vv);
      }
    });

    vals.push({
      title: title,
      text: more,
    });
  });

  return vals;
}

function gen(val) {
  val = val.replaceAll('\r', '');
  var vals = [];
  var xval = val.trim();
  let res = xval.replace(/^\s+/gms, '[splitx]');
  console.log(res);

  const lns = res.split('[splitx]');

  lns.forEach((l) => {
    var xpl = l.trim().split('\n');

    var title = xpl[0];
    var more = [];
    xpl.forEach((vv, i) => {
      if (i > 0) {
        more.push(vv);
      }
    });

    vals.push({
      title: title,
      text: more,
    });
  });

  return vals;
}

function frame3(inp) {
  var me = {};

  var xgen = function (elm) {
    $(elm).on('change keyup', () => {
      me.gen();
    });
  };

  var canv = document.createElement('canvas');
  canv.style.direction = 'rtl';
  canv.style.backgroundColor = 'green';
  var ctx = canv.getContext('2d');

  canv.height = inp.height;
  canv.width = inp.width;

  var sections = (canv.height - inp.titlefontsize) / 3;
  var pos = inp.titlefontsize;

  me.poses = [];
  me.titles = [];
  me.texts = [];
  me.textsizes = [];

  me.fontname = fontlist();
  me.fontname.attr("class","allframestitlefonts")
  me.fontname.val(getCookie("txtfontname1"))

  me.fontname2 = fontlist();
  me.fontname2.attr("class","allframestextfonts")
  me.fontname2.val(getCookie("txtfontname2"))

  me.fontname.on('mouseup', () => {
   
    setTimeout(()=>{
      $(".allframestitlefonts").val(me.fontname.val())
    },100);

    setTimeout(()=>{
     $(".allframestitlefonts").trigger('change')

    },200);

  });


  me.fontname.on('change', () => {
    me.gen();
    setCookie("txtfontname1",me.fontname.val(),9999)
  });

  me.fontname2.on('change', () => {
    me.gen();
    setCookie("txtfontname2",me.fontname2.val(),9999)
  });

  me.fontname2.on('mouseup', () => {
   


    setTimeout(()=>{
      $(".allframestextfonts").val(me.fontname2.val())
    },100);

    setTimeout(()=>{
     $(".allframestextfonts").trigger('change')
    },200);


  });


  var controller;

  for (var x = 0; x <= 2; x++) {
    var posval = document.createElement('input');
    posval.type = 'range';
    posval.min = 0;
    posval.style.width = '100%';
    posval.max = inp.height;
    posval.value = pos;
    xgen(posval);
    me.poses.push(posval);
    pos += sections;

    var title = document.createElement('textarea');
    title.innerHTML = inp.vals[x].title;
    xgen(title);
    me.titles.push(title);

    var text = document.createElement('textarea');
    text.innerHTML = inp.vals[x].text.join('\n');
    xgen(text);
    me.texts.push(text);

    var textsize = document.createElement('input');
    textsize.type = 'range';
    textsize.style.width = '100%';
    textsize.min = 0;
    textsize.max = inp.height;
    textsize.value = inp.textfontsize;
    xgen(textsize);
    me.textsizes.push(textsize);
  }

  me.gen = () => {
    setTimeout(() => {
      ctx.fillStyle = inp.bg;
      //  ctx.fillRect(0, 0, inp.width, inp.height);
      ctx.fillStyle = 'black';
      ctx.textAlign = 'right';

      ctx.drawImage(inp.img, 0, 0, inp.width, inp.height);

      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#FFFFFF';
/*
      ctx
        .roundRect(
          inp.width * 0.02,
          inp.height * 0.02,
          inp.width - inp.width * 0.04,
          inp.height - inp.height * 0.04,
          20
        )
        .fill();
*/

ctx.roundRect(
  inp.width * 0.02,
  inp.width * 0.02,
  inp.width - inp.width * 0.04,
  inp.height - inp.width * 0.04,
  20
).fill();

      ctx.globalAlpha = 1;

      for (var x = 0; x <= 2; x++) {
        //ctx.font = 'bold ' + inp.titlefontsize + 'px ' + inp.font;
        ctx.font = 'bold ' + inp.titlefontsize + 'px ' +  me.fontname.val();
       

        ctx.fillStyle = '#000000';

        ctx.fillText(
          $(me.titles[x]).val(),
          inp.width - inp.width * 0.03,
          parseInt(me.poses[x].value) + inp.width * 0.01
        );

        ctx.font = ' ' + inp.titlefontsize + 'px ' + inp.font;

        var canvasTxt = window.canvasTxt.default;
        //canvasTxt.font = inp.font;

        canvasTxt.font = me.fontname2.val();

        canvasTxt.fontSize = parseInt($(me.textsizes[x]).val());
        canvasTxt.align = 'right';
        canvasTxt.vAlign = 'top';
        canvasTxt.fontWeight = '';
        canvasTxt.justify = true;
        canvasTxt.lineHeight = '';
        canvasTxt.drawText(
          ctx,
          $(me.texts[x]).val(),
          inp.width * 0.04,
          parseInt(me.poses[x].value) + parseInt($(me.textsizes[x]).val()),
          inp.width - inp.width * 0.08,
          sections
        );
      }
    }, 100);
  };

  me.elem = canv;
  return me;
}

function gen12mah(inp) {
  inp.img.crossOrigin = 'Anonymous';
  inp.img.setAttribute('crossOrigin', '');

  var singlefal = inp.fal;
  var davazdah = [];

  const chunkSize = 3;
  for (let i = 0; i < singlefal.length; i += chunkSize) {
    const chunk = singlefal.slice(i, i + chunkSize);

    var x = frame3({
      font: inp.font,
      height: inp.height,
      width: inp.width,
      bg: 'grey',
      titlefontsize: inp.width * 0.08,
      textfontsize: inp.width * 0.04,
      vals: chunk,
      img: inp.img,
    });

    x.gen();
    davazdah.push(x);
  }

  return davazdah;
}

function fontlist() {

  var xfont = '<select>';
  var sl = '';
var i = 0;
$.each(zfonts, function(key,valueObj){
  

    if (i==0) {
      sl = 'selected';
   } else {
     sl = '';
   }

   i++;
  xfont += '<option value="'+key+'" '+sl+'>'+key+'</option>';


});


xfont += '</select>';





    return $(xfont);

}

function gencover(inp) {
  var title = inp.title;

  var me = {};
  me.title = $('<textarea style="width:100%">');
  me.title.val(title)
  me.colorpicker = $('<input type="color" value="#FFFF00">');
  me.colorpicker2 = $('<input type="color" value="#000000">');
  me.colorpicker3 = $('<input type="color" value="#FFFFFF">');
  me.fontsize = $('<input type="value" value="'+parseInt((inp.width * 0.4) / 3)+'">');
  me.fontname = fontlist();
  me.fontname.val(getCookie('coverfont'));

  

  me.havback = $('<input type="checkbox" value="1" checked>');
  me.havstroke = $('<input type="checkbox" value="1" checked>');

  var canv = document.createElement('canvas');
  canv.style.width = '100%';
  canv.style.backgroundColor = 'green';
  canv.width = inp.width;
  canv.height = inp.height;
  canv.style.direction = 'rtl';
  var ctx = canv.getContext('2d');

  ctx.globalAlpha = 0.7;
  ctx.fillStyle = 'yellow';

  me.colorpicker.change(function () {
    ctx.fillStyle = me.colorpicker.val();
    me.gen();
  });

  me.colorpicker2.change(function () {
    ctx.fillStyle = me.colorpicker2.val();
    me.gen();
  });

  me.colorpicker3.change(function () {
    ctx.fillStyle = me.colorpicker3.val();
    me.gen();
  });


  me.fontsize.change(function () {
    
    me.gen();
  });

  me.havback.change(function () {
    
    me.gen();
  })


  me.fontname.change(function () {
    setCookie("coverfont",me.fontname.val(),9999)
    me.gen();
  })

  

  

  me.havstroke.change(function () {
    
    me.gen();
  })

  me.title.on('keyup',function () {
   
    me.gen();
  });

  globyy = [];
  globhh = [];

  me.gen = function () {
    globyy = [];
    globhh = [];

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, inp.width, inp.height);
    ctx.globalAlpha = 1;
    ctx.drawImage(inp.img, 0, 0, inp.width, inp.height);
    ctx.fillStyle = 'black';
    var canvasTxt = window.canvasTxt.default;
    //canvasTxt.font = inp.font;

    canvasTxt.font = me.fontname.val();



    //me.fontsize.val(parseInt((canv.width * 0.4) / 3))

    canvasTxt.fontSize = me.fontsize.val();
    canvasTxt.align = 'center';
    canvasTxt.vAlign = 'middle';
    canvasTxt.justify = true;
    canvasTxt.fontWeight = '';
    canvasTxt.strokeStyle = 'red';

    canvasTxt.lineHeight = parseInt((canv.width * 0.4) / 3) * 1.5;

    ctx.globalAlpha = 1;

    if (me.havstroke.is(":checked")) {
    globstork = {
      color: me.colorpicker3.val(),
      size: parseInt((canv.width * 0.4) / 10),
    };
   }

    setTimeout(() => {
      /*   canvasTxt.drawText(
      ctx,
      title,
      0,
      canv.height * 0.39,
      canv.width,
      canv.height * 0.4
    );
*/

      ctx.globalAlpha = 0;

      canvasTxt.drawText(ctx, me.title.val(), 0, 0, canv.width, canv.height);

      ctx.globalAlpha = 0.7;
      //ctx.fillStyle = 'yellow';
      ctx.fillStyle = me.colorpicker.val();

      if (me.havback.is(":checked")) {
      ctx.fillRect(
        0,
        globyy[0] - globhh[0],
        inp.width,
        /*globyy[globyy.length-1]-globhh[globhh.length-1]*/ 500
      );
      }


      globyy = [];
      globhh = [];
      ctx.globalAlpha = 1;
      ctx.fillStyle = me.colorpicker2.val();
      canvasTxt.drawText(ctx, me.title.val(), 0, 0, canv.width, canv.height);

      globyy = [];
      globhh = [];

      globstork = false;
      /**/

      ctx.fillStyle = 'white';
      var canvasTxt2 = window.canvasTxt.default;
      canvasTxt2.font = inp.font2;
      canvasTxt2.fontSize = parseInt((canv.width * 0.4) / 6);
      canvasTxt2.align = 'center';
      canvasTxt2.vAlign = 'bottom';
      canvasTxt2.justify = true;

      canvasTxt.drawText(
        ctx,
        'anjelaworld@',
        0,
        0,
        canv.width,
        canv.height - canv.height * 0.05
      );

      /**/
    }, 100);
  };
  // ctx.fillRect(0, canv.height * 0.4, canv.width, canv.height * 0.5);

  me.elem = canv;
  return me;
}

function cmd(pid,cmdv) {
  $.ajax({
  
    type: "POST",
                          url: "cmd/"+pid,
                          data: cmdv,
                          success:function() {
                               
                          }
  
  });
  }

function render(inp) {

  console.log(inp.audioelem.currentTime)

  var pid = inp.pid;


  console.log(pid)

  var ctm = inp.audioelem.currentTime;
  

  $.ajax({
    
    type: "POST",
                          url: "genau/"+pid,
                          data: inp.audioelem.getAttribute("src"),
                          success:function() {
                             

                            console.log("audio saved")


                            console.log("saving frames ...")

                                  inp.allframes.each((id,elem)=>{
                                    var dt = elem.toDataURL();
                                
                                    console.log("...")


                                    $.ajax({
                                    
                                      type: "POST",
                                                            url: "gen/"+pid+"/"+id,
                                                            data: dt,
                                                            success:function() {

                                                           

                                                                  if (id+1===inp.allframes.length) {

                                                                    console.log("all frames saved")

                                                                    var foldr = 'working/'+pid+"/";
                                                                    cmd(pid,"ffmpeg -t 59 -f lavfi -i color=c=white:s="+$("#iwidth").val()+"x"+$("#iheight").val()+" -i appdata/blank.png -i "+foldr+"0.png -i "+foldr+"1.png -i "+foldr+"2.png -i "+foldr+"3.png -i "+foldr+"4.png -filter_complex \"[1:v]loop=-1:10000:0[cov0];[cov0]scale="+$("#iwidth").val()+":-1[cover];[0:v][cover]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:shortest=1[mainlayer];[mainlayer][2:v]overlay=0:0:enable='between(t,0,1)'[layer0];[layer0][3:v]overlay=0:0:enable='between(t,1,15.5)'[layer1];[layer1][4:v]overlay=0:0:enable='between(t,15.5,30)'[layer2];[layer2][5:v]overlay=0:0:enable='between(t,30,44.5)'[layer3];[layer3][6:v]overlay=0:0:enable='between(t,44.5,59)'[finalout]\" -i "+foldr+""+pid+".mp3 -af \"atrim="+ctm+",asetpts=PTS-STARTPTS\"  -map [finalout] -shortest  -map 7:a output/"+pid+".mp4 -y");
                                                                  
                                                                  }
                                                            }
                                     
                                     });
                                  });

                              
                          }
   
   });



 
}


function xrender(inp) {
  var startframe = -1;

  var canv = document.createElement('canvas');

  canv.height = inp.width;
  canv.width = inp.height;

  var ctx = canv.getContext('2d');

  var counter = 0;
  var flipflop = true;
  var beginfal = false;

  var incc = () => {};

  var d = (fx) => {
    if (startframe < 0) {
      startframe = fx;
    }
    var f = fx - startframe;

    var seconds = Math.round(f / 1000);

    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, inp.width, inp.height);

    if (f < 500) {
      counter = 0;
    } else {
      if (!beginfal) {
        counter = 1;
        beginfal = true;
      }

      if (seconds % 15 == 0) {
        if (!flipflop) {
          flipflop = true;

          counter++;
        }
      } else {
        if (flipflop) {
          flipflop = false;
          // counter++
        }
      }
    }

    if (typeof inp.allframes[counter] != 'undefined') {
      ctx.drawImage(inp.allframes[counter], 0, 0);
    }

    if (seconds <= 59) {
      requestAnimationFrame(d);
    }
  };

  setTimeout(() => {
    requestAnimationFrame(d);
  }, 100);

  var dlx = $('<div>...</div>');
  var exportVid = function (blob) {
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    const a = document.createElement('a');
    a.download = 'myvid.' + $('#ft').val();
    a.href = vid.src;
    a.textContent = 'download';
    dlx.append($(a));
  };

  /*audio*/
  //  inp.audio.crossOrigin = 'anonymous';

  var actx = new AudioContext();
  var dest = actx.createMediaStreamDestination();
  var sourceNode = actx.createMediaElementSource(inp.audioelem);
  sourceNode.connect(dest);
  sourceNode.connect(actx.destination);
  var audioTrack = dest.stream.getAudioTracks()[0];
  inp.audioelem.play();
  /**/
  var stream = canv.captureStream();
  stream.addTrack(audioTrack);
  var rec = new MediaRecorder(stream, {
   // mimeType: 'video/webm;codecs=h264',
   // mimeType: 'video/'+$('#ft').val(),
    mimeType: 'video/mp4',
    
    audioBitsPerSecond: parseInt($('#abr').val()), // 128 kbit/s
    videoBitsPerSecond: parseInt($('#vbr').val()), // 2 Mbit/s
  });

  const chunks = [];
  rec.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  rec.onstop = (e) => {
    exportVid(new Blob(chunks, { type: 'video/mp4' }));
  };

  setTimeout(() => {
    rec.start();
  }, 100);

  setTimeout(() => {
    rec.stop();
    inp.audioelem.pause();
  }, /* 59000 */ parseInt($("#maxt").val()));

  return dlx;
}

function loadfont(fname) {
  $(document.body).append(
    '<div style="font-family:' + fname + ';visibility:hidden">فونت</div>'
  );
}

function fal(inp) {
  loadfont(inp.titlefont);
  loadfont(inp.textfont);
  loadfont(inp.tagfont);

  var thisfal = $(
    '<div style="overflow:scroll;height:350px; white-space: nowrap;position: relative;"></div>'
  );

  var covccont = $(
    '<div style="display:inline-block;margin-left:2rem;width:300px;vertical-align: top;"></div>'
  );

  var aucont = $(
    '<div style="display:inline-block;margin-left:2rem;width:300px;vertical-align: top;"></div>'
  );

  aucont.append(inp.audioelem);
  thisfal.append(aucont);

  thisfal.append(covccont);

  var singlefal = gen(inp.text);
  var faltitle = singlefal[0];

  var gcov = gencover({
    font2: inp.tagfont,
    font: inp.titlefont,
    fontsize:50,
    title: faltitle.title + '\n' + faltitle.text.join('\n') + '',
    width: inp.width,
    height: inp.height,
    img: inp.img,
  });

  gcov.gen();
  covccont.append(gcov.elem);
  var covconto = $('<div></div>');
  covconto.append(gcov.colorpicker);
  covconto.append(gcov.colorpicker2);
  covconto.append(gcov.colorpicker3);
  covconto.append('<br> fontsize:');
  covconto.append(gcov.fontsize);
  covconto.append('<br> havebg:');
  covconto.append(gcov.havback);
  covconto.append('<br> havestroke:');
  covconto.append(gcov.havstroke);

  covconto.append('<br> fontname:');
  covconto.append(gcov.fontname);


  covconto.append('<br>');
  covconto.append(gcov.title);

  covccont.append(covconto);

  singlefal.splice(0, 1);

  gen12mah({
    font: inp.textfont,
    fal: singlefal,
    width: inp.width,
    height: inp.height,
    img: inp.img,
  }).forEach((e) => {
    e.elem.style.width = '100%';

    var ccont = $(
      '<div style="display:inline-block;margin-left:2rem;width:300px"></div>'
    );

    ccont.append($(e.elem));
    var controler = $('<div></div>');

    // controler.hide();
    controler.append('font:');
    controler.append($(e.fontname));
    controler.append('<br>');

    controler.append('font2:');
    controler.append($(e.fontname2));
    controler.append('<br>');

    e.titles.forEach((t, i) => {
      controler.append($(e.textsizes[i]));
      controler.append('<br>');
      controler.append($(e.poses[i]));
      controler.append('<br>');
      controler.append($(t));
      controler.append('<br>');
      controler.append($(e.texts[i]));
      controler.append('<hr>');
    });

    ccont.append(controler);

    thisfal.append(ccont);
  });

  var alfalsframe = $('canvas', thisfal);

  thisfal.append(
    $('<button style="position: fixed;right: 5px;">gen</button>').click(() => {
      thisfal.append(
        render({
          audioelem: inp.audioelem,
          allframes: alfalsframe,
          width: inp.width,
          height: inp.height,
          pid: inp.pid
        })
      );
    })
  );

  return thisfal;
}
