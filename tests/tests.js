test('Test the media query parser', function() {
  var tags = [
      {name: 'google-chrome', network: 'stackoverflow'},
      {name: 'html5', network: 'stackoverflow'},
      {name: 'html5', network: 'gamedev'}
  ];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  equals(ql.tags.length, 3, 'Correct number of tags');
  equals(ql.tags[0].name, 'google-chrome', 'Tag names do match');
  equals(ql.tags[0].getNetwork().root, 'stackoverflow.com',
      'Root URLs match');
});
