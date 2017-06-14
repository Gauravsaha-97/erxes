import React, { PropTypes, Component } from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  ButtonToolbar,
  Modal,
  Button,
} from 'react-bootstrap';
import Editor from './Editor';

class WidgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { content: '' };

    this.onContentChange = this.onContentChange.bind(this);
    this.save = this.save.bind(this);
  }

  save(e) {
    e.preventDefault();

    const { save, customers } = this.props;

    return save(
      {
        title: document.getElementById('title').value,
        customerIds: customers.map(customer => customer._id.toString()),
        fromUserId: Meteor.userId(),
        email: {
          templateId: document.getElementById('emailTemplateId').value,
          subject: document.getElementById('emailSubject').value,
          content: this.state.content,
        },
      },
      () => {
        this.context.closeModal();
      },
    );
  }

  onContentChange(content) {
    this.setState({ content });
  }

  renderCustomers() {
    return this.props.customers.map(customer => {
      return (
        <p key={customer._id.toString()}>
          {customer.name} - {customer.email}
        </p>
      );
    });
  }

  render() {
    return (
      <form onSubmit={this.save}>
        {this.renderCustomers()}

        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl id="title" type="text" required />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Email subject</ControlLabel>
          <FormControl id="emailSubject" type="text" required />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Email templates</ControlLabel>

          <FormControl id="emailTemplateId" componentClass="select">

            <option />
            {this.props.emailTemplates.map(t =>
              <option key={t._id} value={t._id}>
                {t.name}
              </option>,
            )}
          </FormControl>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Content</ControlLabel>
          <Editor onChange={this.onContentChange} />
        </FormGroup>

        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            <Button type="submit" bsStyle="primary">Save</Button>
          </ButtonToolbar>
        </Modal.Footer>
      </form>
    );
  }
}

WidgetForm.propTypes = {
  customers: PropTypes.array.isRequired,
  emailTemplates: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired,
};

WidgetForm.contextTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default WidgetForm;
