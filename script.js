function checkEntry(string,entry) {
  return (string.length >= entry.length+2 && string.substring(0,entry.length+2) == '['+entry+' ');
}
function lengthenNum(num) {
  if (num < 9) { return '0'+num; }
  else { return num; }
}
function convertPGN() {
  var inputString = document.getElementById('input').value;
  var output = document.getElementById('output');
  var input = inputString.split('\n');
  var moves = "";
  for (var i = 0; i < input.length; i++) {
    if (input[i][0] == '[') {
      if (checkEntry(input[i],'Site')) { var site = input[i] + '\n'; }
      else if (checkEntry(input[i],'Date')) { 
        var dateSplit = input[i].split(' ');
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sept', 'Oct', 'Nov', 'Dec'];
        var date = '[Date \"'+dateSplit[4]+'.'+lengthenNum(months.indexOf(dateSplit[2])+1)+'.'+dateSplit[3]+'\"]\n';
        var UTCDate = '[UTCDate \"'+dateSplit[4]+'.'+lengthenNum(months.indexOf(dateSplit[2])+1)+'.'+dateSplit[3]+'\"]\n';
        var UTCTime = '[UTCTime \"'+dateSplit[5]+'\"]\n';
      }
      else if (checkEntry(input[i],'White')) { var white = input[i] + '\n'; }
      else if (checkEntry(input[i],'Black')) { var black = input[i] + '\n'; }
      else if (checkEntry(input[i],'Result')) { var result = input[i] + '\n'; }
      else if (checkEntry(input[i],'WhiteElo')) { var whiteElo = input[i] + '\n'; }
      else if (checkEntry(input[i],'BlackElo')) { var blackElo = input[i] + '\n'; }
      else if (checkEntry(input[i],'TimeControl')) {
        var splitList = input[i].split('\"');
        var timeList = splitList[1].split('+');
        var timeControl = '[TimeControl \"'+parseInt(timeList[0])*60+'+'+timeList[1]+'\"]\n';
      }
    }
    else {
      /* Termination
      "{ The game is a draw. } 1/2-1/2"
      "{ White wins by checkmate. } 1-0"
      "{ White resigns. } 0-1"
      "{ Black wins by checkmate. } 0-1"
      "{ Black resigns. } 1-0"
      */
      //var splitMove = 
      var moveEdited = input[i].replaceAll('-', '');
      moveEdited = moveEdited.replaceAll(' .. ', ' ');
      var alpha = 'abcdefghijk';
      for (var j = 3; j < 11; j++) {
        for (var k = 4; k < 12; k++) {
          moveEdited = moveEdited.replaceAll(alpha[j]+k,alpha[j-3]+(k-3));
        }
      }
      moveEdited = moveEdited.replaceAll('OOO','O-O-O');
      moveEdited = moveEdited.replaceAll('OO','O-O');
      var pieceNames = "NBRQ";
      for (var j = 0; j < 4; j++) {
        moveEdited = moveEdited.replaceAll('x'+pieceNames[j],'x');
      }
      var lastChar = moveEdited[moveEdited.length-1];
      if (lastChar == 'R' || lastChar == 'T' || lastChar == 'D' || lastChar == 'P' || lastChar == 'S') {
        moves += moveEdited.substring(0, moveEdited.length-2);
        if (input[i].split(' ').length != 2) {
          if (lastChar == 'R' || lastChar == 'T' || lastChar == 'D' || lastChar == 'P' || lastChar == 'S') {
            break;
          }
          moves += moveEdited.substring(0, moveEdited.length-1);
        }
        break;
      }
      moves += moveEdited + '\n';
    }
  }
  output.value = "[Event \"Rated Atomic game\"]\n" + site + date + white + black + result + UTCDate + UTCTime + whiteElo + blackElo + '[Variant "Atomic"]\n' + timeControl + '[ECO "?"]\n[Opening "?"]\n[Annotator "lichess.org"]\n'+moves;
}

function pasteFromClipboard() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('input').value = text;
    convertPGN();
    document.getElementById('output').focus();
    document.getElementById('output').select();
  });
}
function copyToClipboard() {
  navigator.clipboard.writeText(document.getElementById('output').value);
  document.getElementById('output').focus();
  document.getElementById('output').select();
}
function quickPGN() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('input').value = text;
    convertPGN();
    document.getElementById('output').focus();
    document.getElementById('output').select();
    copyToClipboard();
  });
}

function resizeTextBox(id) {
  var input = document.getElementById(id);
  if (id == 'input') { input.style.left = window.innerWidth/2 - tileSize * 3 + 'px'; }
  else { input.style.left = window.innerWidth/2 + tileSize * 3 + 'px'; }
  input.style.top = window.innerHeight/2 + 'px';
  input.style.width = tileSize * 3 + 'px';
  input.style.height = tileSize * 4 + 'px';
  input.style.backgroundSize = tileSize * 3 + 'px'; + ' ' + tileSize * 4 + 'px';
  input.style.border = tileSize/40 + 'px solid #FFFFFF';
}
function resizeLogo(id) {
  var input = document.getElementById(id)
  if (id == 'chesscomlogo') { input.style.left = window.innerWidth/2 - tileSize * 3 + 'px'; }
  else { input.style.left = window.innerWidth/2 + tileSize * 3 + 'px'; }
  input.style.top = window.innerHeight/2 - tileSize * 2.5 + 'px';
  input.style.width = tileSize + 'px';
  input.style.height = tileSize + 'px';
  input.style.backgroundSize = input.style.width + ' ' + input.style.height;
}
function resizeBackground() {
  document.body.style = 'background: repeating-conic-gradient(#120e0a 0% 25%, transparent 0% 50%) 50% / '+tileSize*2+'px '+tileSize*2+'px; background-position: '+(window.innerWidth/2-tileSize/2)+'px '+(window.innerHeight/2-tileSize)+'px; background-color: #171612;';
}
function resizeArrow() {
  var arrow = document.getElementById('arrow');
  arrow.style.left = window.innerWidth/2 + 'px';
  arrow.style.top = window.innerHeight/2 + 'px';
  arrow.style.width = tileSize + 'px';
  arrow.style.height = tileSize + 'px';
  var glow = document.getElementById('glow');
  glow.style.width = '0px';
  glow.style.height = '0px';
  glow.style.left = window.innerWidth/2 + 'px';
  glow.style.top = window.innerHeight/2 + 'px';
  glow.style.zIndex = -1;
  glow.style.boxShadow = '0px 0px '+window.innerWidth+'px ' + window.innerWidth/4 + 'px rgba(48,46,43,0.5)';
}
function resizeButton(id) {
  var input = document.getElementById(id)
  if (id == 'paste') { input.style.left = window.innerWidth/2 - tileSize * 3 + 'px'; }
  else { input.style.left = window.innerWidth/2 + tileSize * 3 + 'px'; }
  input.style.top = window.innerHeight/2 + tileSize * 2.50 + 'px';
  input.style.width = tileSize*3.050 + 'px';
  input.style.height = tileSize/2 + 'px';
  input.style.border = tileSize/40 + 'px solid #FFFFFF';
}

function resize() {
  tileSize = Math.min(window.innerWidth / 13, window.innerHeight / 6);
  resizeArrow();
  resizeTextBox('input'); resizeTextBox('output');
  resizeLogo('chesscomlogo'); resizeLogo('lichesslogo');
  resizeBackground();
  resizeButton('copy'); resizeButton('paste');
}

resize();
window.onresize = function() {
  resize();
}
window.onload = resize();