var socket = io();
var freq = 7000000;
var freqMhz = freq / 1000000;
$("#sendBtn").click(function(){
    var txMsg = $("#hexInput").val();
    socket.emit('sendmsg',txMsg);
});

$("#modeBtn").click(function () {
    socket.emit('modeBtn', 'mode');
});


//面倒になったので、周波数を1MHz単位で上下することにした。
$("#downBtn").click(function () {

    freq = freq - 1000000
    if (freq < 500000) { freq = 500000; }

    socket.emit('setfreq', String(freq));
});

$("#upBtn").click(function () {
    freq = freq + 1000000
    if (freq > 440000000) { freq = 440000000; }

    socket.emit('setfreq', String(freq));
});


socket.on('freq', function (data) {
    freq = Number(data);
    freqMhz = freq / 1000000;
    $('h1').text(freqMhz.toFixed(6));
});
socket.on('mode', function (data) {
    $('h2').text(data); 
});
socket.on('rcvmsg', function (data) {
    $('h3').text(data);
});
//読み込み時に周波数とモードを問い合わせる。
$(document).ready(function () {
    socket.emit('sendmsg', 'fefe58e003fd');
    //半二重なので衝突してしまうため、100ms待ってモードを問い合わせる。
    setTimeout(function () {    //匿名メソッド
        socket.emit('sendmsg', 'fefe58e004fd');
    }, 200);
            
});

$(function () {
    $(".knob").knob();
});

var tuningStep = 1000;
var oldValue = 0;
$(".knob").knob({
    'change': function (v) {
        var newValue = Number($(".knob").val());
        if (oldValue < newValue && (newValue - oldValue) != 20 || (oldValue - newValue) == 20) {

            freq = freq + tuningStep;

        } else {

            freq = freq - tuningStep;

        }
        oldValue = newValue;
        //直接更新するのはやめて、折り返しを表示することにする。
        //freqMhz = freq / 1000000;
        //$('h1').text(freqMhz.toFixed(6));
        socket.emit('setfreq', String(freq));
    }

});
                