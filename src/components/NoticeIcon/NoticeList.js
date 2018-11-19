import React from 'react';
import { Avatar, List, Icon } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';

export default function NoticeList({
  data = [],
  onClick,
  onClear,
  title,
  locale,
  emptyText,
  emptyImage,
  showClear = true,
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  const icon = { 101:{type:"check-circle", color:"#52c41a"}, 102:{type:"close-circle", color:"#eb2f96"},}
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar className={styles.avatar} src={item.avatar} />
            ) : (
              item.avatar
            )
          ) : (
            item.type ? 
              <Icon type={(icon[item.type]||"").type} theme="twoTone" twoToneColor={(icon[item.type]||"").color} />
              :
              null
          );

          return (
            <List.Item className={itemCls} key={item.id || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={<span className={styles.iconElement}>{leftIcon}</span>}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={item.content}>
                      {item.content}
                    </div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      {showClear ? (
        <div className={styles.clear} onClick={onClear}>
          {locale.clear}
          {title}
        </div>
      ) : null}
    </div>
  );
}
