$(document).ready(function() {
  // total 3 phase
  // 1: insert class with name and start date
  // 2: assign teacher for this class
  // 3: add students for this class
  var phase = 0;

  function changeButton() {
    if (phase === 0) {
      $('#previous').removeClass('hide').prop('disabled', true);
    }
    if (phase > 0) {
      $('#previous').prop('disabled', false);
    }
    if (phase === 2) {
      $('#next').addClass('hide');
      $('#confirm').removeClass('hide');
    } else {
      $('#next').removeClass('hide');
      $('#confirm').addClass('hide');
    }
  }

  $('#previous').on('click', function() {
    if (phase > 0) phase -= 1;
    changeButton();
  });

  $('#next').on('click', function() {
    if (phase < 2) phase += 1;
    changeButton();
  });
});
