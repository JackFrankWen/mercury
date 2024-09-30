import React , {useState}from "react";
import {Button, Input} from "antd";
import PinduoduoModal from "./modalPinduoduo";

function UploadCenter(): JSX.Element {
    const [text, setText] = useState("https://mobile.pinduoduo.com");
    const [openPinduodou, setOpenPinduoduo] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    return (
        <div>
            <Button onClick={()=>{
                window.mercury.crawler({
                    web: 'pinduoduo',
                    action: 'open',
                }).then((res)=>{
                    console.log(res)
                    setText(res);
                });
            }}> 拼多多</Button>
            <Button onClick={()=>{
                window.mercury.getWebpageContent(text).then((res)=>{
                    console.log(res);
                    setText(res);
                    const {ordersStore = {}} = res;
                    const {orders = []} = ordersStore;
                    setDataSource(orders)
                    setOpenPinduoduo(true);
                });
            }}>获取列表</Button>
            <Input.TextArea value={text}/>
            {
                openPinduodou && <PinduoduoModal
                    visible={openPinduodou}
                    dataSource={dataSource}
                    onOk={()=>{
                        setOpenPinduoduo(false);
                    }}
                    onCancel={()=>{
                        setOpenPinduoduo(false);
                    }}
                />
            }
        </div>
    );
}
export default UploadCenter;