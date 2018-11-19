import React, { PureComponent } from 'react';
import { Button, notification, Card, Select } from 'antd';
import ReactQuill from 'react-quill';
import ImageWrapper from '@/components/ImageWrapper'
import BizIcon from '@/components/BizIcon'

import 'react-quill/dist/quill.snow.css';
import styles from './test.less';

class Test extends PureComponent {
  state = {
    value: 'test',
  };

  handleChange = (value) => {
    this.setState({
      value,
    })
  };

  prompt = () => {
    notification.open({
      message: 'We got value:',
      description: <span dangerouslySetInnerHTML={{ __html: this.state.value }} />,
    });
  };

  render() {

    const {Option} = Select;
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    return (
      <div className={styles.wodeTian}>
        test
        <ImageWrapper
          src="https://os.alipayobjects.com/rmsportal/mgesTPFxodmIwpi.png"
          desc="示意图"
        />
        <Select
          mode="multiple"
          style={{ width: 300 }}
          placeholder="Please select"
          className={styles.customSelect}
        >
          {children}
        </Select>
        <BizIcon type="ali-pay" />
        <Card title="富文本编辑器">
          <ReactQuill value={this.state.value} onChange={this.handleChange} />
          <Button style={{ marginTop: 16 }} onClick={this.prompt}>Prompt</Button>
        </Card>
      </div>
    )
  }
}

export default Test
