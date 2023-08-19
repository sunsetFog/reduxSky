import { useEffect } from 'react';
import { connect } from 'react-redux';

const HomeView = (props: object) => {
  useEffect(() => {
    console.log(props);
  });
  return <div>"hello world"</div>;
};

export default connect((state: any) => {
  console.log(state);
  return {
    theme: state.app.theme.name,
  };
})(HomeView);
