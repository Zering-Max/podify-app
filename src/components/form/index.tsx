import {Formik, FormikHelpers} from 'formik';
import React = require('react');

interface Props<T> {
  initialValues: any;
  validationSchema: any;
  onSubmit(values: T, formikHelpers: FormikHelpers<T>): void;
  children: React.ReactNode;
}

const Form = <T extends object>(props: Props<T>) => {
  return (
    <Formik
      onSubmit={props.onSubmit}
      initialValues={props.initialValues}
      validationSchema={props.validationSchema}>
      {props.children}
    </Formik>
  );
};

export default Form;
