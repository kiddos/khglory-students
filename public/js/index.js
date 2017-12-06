$(document).ready(function() {
  function animateNumbers($field, startNumber, endNumber, time) {
    var ticks = 66;
    var increment = Math.max(parseInt((endNumber - startNumber) / ticks), 1);
    var current = startNumber;
    var next = function() {
      current += increment;
      if (current > endNumber) current = endNumber;
      $field.text(current);

      if (current < endNumber) {
        setTimeout(next, time / ticks);
      }
    };
    next();
  }

  function plotGenderPieChart(id, data) {
    var genderData = [{gender: '男', count: 0}, {gender: '女', count: 0}];
    for (var i = 0; i < data.length; ++i) {
      if (data[i].gender === '男') {
        genderData[0].count += 1;
      } else if (data[i].gender === '女') {
        genderData[1].count += 1;
      }
    }

    var svg = d3.select('#' + id).attr('width', 150).attr('height', 150);
    var g = svg.append('g').attr('transform', 'translate(75, 75)');
    var pie = d3.pie().sort(null).value(function(d) {
      return d.count;
    });
    var trans = d3.transition().duration(2000);
    var arc = g.selectAll('.arc').data(pie(genderData))
      .enter().append('g').attr('class', 'arc');

    var color = ['#4997FF', '#FF5A49'];
    var path = d3.arc().outerRadius(75).innerRadius(0);
    arc.append('path').attr('d', path).attr('fill', function(d, i) {
      return color[i];
    });

    var label = d3.arc().outerRadius(40).innerRadius(40);
    arc.append('text').attr('transform', function(d) {
      return 'translate(' + label.centroid(d) + ')';
    }).attr('dy', '0.35em').text(function(d) {
      return d.data.gender;
    });
  }

  function plotReligionPieChart(id, data) {
    var religionData = [
      {religion: '基督教', count: 0},
      {religion: '天主教', count: 0},
      {religion: '佛教', count: 0},
      {religion: '伊斯蘭教', count: 0},
      {religion: '其他', count: 0},
    ];
    for (var i = 0; i < data.length; ++i) {
      var found = false;
      for (var j = 0; j < religionData.length; ++j) {
        if (data[i].religion === religionData[j].religion) {
          religionData[j].count += 1;
          found = true;
        }
      }
      if (!found) {
        religionData[religionData.length - 1].count += 1;
      }
    }

    var svg = d3.select('#' + id).attr('width', 250).attr('height', 150);
    var g = svg.append('g').attr('transform', 'translate(75, 75)');
    var pie = d3.pie().sort(null).value(function(d) {
      return d.count;
    });
    var trans = d3.transition().duration(2000);
    var arc = g.selectAll('.arc').data(pie(religionData))
      .enter().append('g').attr('class', 'arc');

    var color = ['#49AAFF', '#72E86B', '#F6B742', '#F8684E', '#AFAFAF'];
    var path = d3.arc().outerRadius(75).innerRadius(0);
    arc.append('path').attr('d', path).attr('fill', function(d, i) {
      return color[i];
    });

    var label = d3.arc().outerRadius(60).innerRadius(60);
    arc.append('text').attr('transform', function(d) {
      return 'translate(' + label.centroid(d) + ')';
    }).attr('dy', '0.35em').text(function(d) {
      if (d.data.count > 0) {
        return d.data.religion;
      } else {
        return '';
      }
    });
  }

  $.get('/students', function(students) {
    animateNumbers($('#student-count'),
      parseInt($('#student-count').text()), students.length, 1000);

    if (student.length > 0) {
      plotGenderPieChart('student-gender', students);
      plotReligionPieChart('student-religion', students);
    }
  });

  $.get('/teachers', function(teachers) {
    animateNumbers($('#teacher-count'),
      parseInt($('#teacher-count').text()), teachers.length, 1000);

    if (teachers.length > 0) {
      plotGenderPieChart('teacher-gender', teachers);
    }
  });

  $.get('/classes', function(classes) {
    animateNumbers($('#class-count'),
      parseInt($('#class-count').text()), classes.length, 1000);
  });
});
