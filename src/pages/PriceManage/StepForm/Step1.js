import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Radio, Card , Checkbox, Col, Icon, Table, message} from 'antd';
import { EditableFormRow, EditableCell} from '@/components/EditableCell';
import router from 'umi/router';
import Yuan from '@/utils/Yuan';

import styles from './style.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@connect(({ gongde }) => ({
  facilityList: gongde.facilityList,
}))
@Form.create()
class Step1 extends React.PureComponent {
  
  constructor(props) {
    super(props)
    this.state = {
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      expandTable: false,
      radioValue:"1",
      loading: true,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'gongde/fetch',
    });
    this.timeoutId = setTimeout(() => {
      this.setState({
        loading: false,
      });
      this.onCheckAllChange({target:{checked:true}})
    }, 600);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  //  表格保存事件
  handleSave = (row) => {
    const newData = [...this.state.checkedList];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ checkedList: newData });
  }

  //  单选事件
  onRadioChange = (e) => {
    this.setState({
      radioValue: e.target.value
    })
  }
  
  //  多选事件
  onCheckboxChange = (checkedArr) => {
    const { facilityList } = this.props;
    const { checkedList } = this.state;
    let arr = []
    checkedArr.forEach(v=>{
      let obj = checkedList.find(c=>v===c.name)
      let obj2 = facilityList.find(c=>v===c.name)
      obj ? arr.push(obj) : arr.push(obj2)
    })
    
    this.setState({
      checkedList: arr,
      indeterminate: !!checkedArr.length && (checkedArr.length < facilityList.length),
      checkAll: checkedArr.length === facilityList.length,
    });
  }

  onCheckAllChange = (e) => {
    const { facilityList } = this.props;
    // this.props.form.setFieldsValue({
    //   facility: e.target.checked ? facilityList.map(v=>v.name) : [],
    // })
    this.setState({
      checkedList: e.target.checked ? facilityList : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }


  //  当前祈福塔价格 事件
  toggleTable = () => {
    const { expandTable } = this.state;
    this.setState({
      expandTable: !expandTable,
    });
  };

  renderTable() {
    const { expandTable } = this.state;
    return expandTable ? this.renderAdvancedTable() : this.renderSimpleTable();
  }

  renderSimpleTable(){
    return (
      <div>
        <span className={styles.textdesc}>当前祈福塔价格</span>
          <a style={{ marginLeft: 8 }} onClick={this.toggleTable}>
            展开 <Icon type="down" />
          </a>
      </div>
    )
  }

  renderAdvancedTable(){
    const columns = [
      {
        title: "序号",
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index)  => index + 1 , 
      },
      {
        title: "塔名",
        dataIndex: 'name',
      },
      {
        title: "1天",
        dataIndex: 'day',
        render: d => <Yuan>{d/100}</Yuan> , 
      },
      {
        title: "1月",
        dataIndex: 'month',
        render: d => <Yuan>{d/100}</Yuan> , 
      },
      {
        title: "1年",
        dataIndex: 'year',
        render: d => <Yuan>{d/100}</Yuan> , 
      },
      {
        title: "长明",
        dataIndex: 'longtime',
        render: d => <Yuan>{d/100}</Yuan> , 
      },
    ];

    const { facilityList } = this.props;
    const ftable = facilityList.map(v=>({
      id:v.id,
      name:v.name,
      day:(v.priceList.find(w=>w.duration===1)||"").price,
      month:(v.priceList.find(w=>w.duration===30)||"").price,
      year:(v.priceList.find(w=>w.duration===365)||"").price,
      longtime:(v.priceList.find(w=>w.duration===7200)||"").price
    }))
    return (
      <div>
        <Table
          rowKey={record => record.id}
          size="small"
          columns={columns}
          dataSource={ftable}
          pagination={{
            style: { marginBottom: 0 },
            pageSize: 5,
          }}
        />
        <div>
          <a style={{ marginLeft: 8 }} onClick={this.toggleTable}>
            收起 <Icon type="up" />
          </a>
        </div>
      </div>
    )
  }

  render() {
    const { checkedList, radioValue, loading: stateLoading } = this.state;
    const { form, dispatch, facilityList, loading: propsLoding, } = this.props;
    const loading = propsLoding || stateLoading;

    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        let subList = checkedList
        const { day, month, year, longtime } = values
        if(day){
          subList = subList.map(v=>({ ...v, day, month, year, longtime, }))
        }
        if( subList.filter(v=>v.day&&v.month&&v.year&&v.longtime).length !== subList.length ){
          return message.error('表单未完成')
        }
        subList = subList.map(v=>({ fid:v.id, name:v.name, day:v.day*100, month:v.month*100, year:v.year*100, longtime:v.longtime*100, }))
        if (!err) {
          dispatch({
            type: 'apply/add',
            payload: subList,
          });
          router.push('/price/step-form/result');
        }
      });
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    }
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };

    const columns = [
      {
        title: "塔名",
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: "1天",
        dataIndex: 'day',
        width:'20%',
        editable: true,
        render: d => d>0?<Yuan>{d}</Yuan>:'-' , 
      },
      {
        title: "1月",
        dataIndex: 'month',
        width:'20%',
        editable: true,
        render: d => d>0?<Yuan>{d}</Yuan>:'-' , 
      },
      {
        title: "1年",
        dataIndex: 'year',
        width:'20%',
        editable: true,
        render: d => d>0?<Yuan>{d}</Yuan>:'-' , 
      },
      {
        title: "长明",
        dataIndex: 'longtime',
        width:'20%',
        editable: true,
        render: d => d>0?<Yuan>{d}</Yuan>:'-' , 
      },
    ];

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columnss = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <Fragment>
        <Card bordered={false} loading={loading}>
          <Col xl={14}>
            <Form layout="horizontal" className={radioValue==='1'?styles.stepForm:styles.stepForm700} hideRequiredMark>
              <FormItem {...formItemLayout} label="祈福塔">
                <Checkbox
                  className={styles.allCheck}
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >全选</Checkbox>
                {/* {getFieldDecorator('facility', {
                  rules: [
                    {
                      required: true,
                      message: '至少选一项',
                    },
                  ],
                })( */}
                  <CheckboxGroup options={facilityList.map(v=>v.name)} value={checkedList.map(v=>v.name)} onChange={this.onCheckboxChange} />
                {/* )} */}
              </FormItem>
                <Col>
                  <span className={styles.price}>价格：</span>
                  <Radio.Group onChange={this.onRadioChange} value={radioValue}>
                    <Radio value="1">合并调价</Radio>
                    <Radio value="2">逐个调价</Radio>
                  </Radio.Group>
                </Col>
                { radioValue === "1"?
                  [
                    {text:'1天',id:'day'},
                    {text:'1月',id:'month'},
                    {text:'1年',id:'year'},
                    {text:'长明',id:'longtime'},
                  ].map((v)=>
                      <FormItem key={v.id} {...formItemLayout} label={v.text}>
                        {getFieldDecorator(v.id, {
                          rules: [
                            { required: true,  message: '请输入价格', },
                            { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字', },
                          ],
                        })(<Input prefix="￥" placeholder='请输入价格' style={{ width: '200px' }}  />)}
                      </FormItem>
                  ):
                  <Table
                    rowKey={record => record.id}
                    columns={columnss}
                    dataSource={checkedList}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    pagination={false}
                  />
                }
                

                <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit" onClick={onValidateForm}>
                    提交
                  </Button>
                </FormItem>
            </Form>
          </Col>
          <Col offset={1} xl={9}>
            <div className={styles.rightBlock}>{this.renderTable()}</div>
          </Col>
        </Card>
      </Fragment>
    );
  }
}

export default Step1