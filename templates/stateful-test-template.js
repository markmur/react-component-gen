import $NAME from './$NAME';

describe('<$NAME />', () => {
  var component;
  var node;

  it('should shallow mount', done => {

    component = shallow(<$NAME />);
    node = component.node;
    done();
  });

  it('should have state', done => {
    expect(node.state).to.exist;
    done();
  });
});
