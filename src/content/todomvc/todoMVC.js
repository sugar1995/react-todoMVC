/**
 * Created by swk on 2017/8/5.
 */
import React,{Component} from 'react';
import Input from './todoinput/input';
import ItemList from './items/items';
import ControlBar from  './controlbar/controlbar';

export default class TodoMVC extends  Component{
    constructor(props){
        super(props);
        this.state={
            list : [],
           /* controlSet : {
                showAll : true,
                showActive : false,
                showCompleted : false
            },*/
            status : 'showAll',
            activeCounter : 0,  //active item的计数器
           // counter : 0
            listStatus : true
        };
        this.handleItemChange=this.handleItemChange.bind(this);
        this.handleKeyDown=this.handleKeyDown.bind(this);
        this.handleItemClick=this.handleItemClick.bind(this);
        //this.showNodesLength=this.showNodesLength.bind(this);
        this.handleControlBarClick=this.handleControlBarClick.bind(this);
        this.handleClearCompleted=this.handleClearCompleted.bind(this);
        this.handleItemListDisplay=this.handleItemListDisplay.bind(this);
    }
    genNonDuplicateID (){    //生成唯一Id的函数
        let idStr=Date.now().toString();
        idStr+=Math.random().toString().substr(3);
        return idStr;
    }
    handleKeyDown(value){   //输入框按下Enter键时会触发 ，新增一个item
        let list=this.state.list;
        let item={
            value : value,
            completed : false,
            active : true,
            id :this.genNonDuplicateID()
        };
        list.push(item);
        this.setState((prevState)=>({
            list : list,
            activeCounter : prevState.activeCounter+1,
            listStatus : true
        }));
    }
    handleItemChange(value ,id){       //编辑item时触发  改变item的值
        let list=this.state.list;
        /*console.log(list);*/
        list=list.map((item)=>{
            if(item.id===id){
                item.value=value;
            }
            return item;
        });
      /*  list.forEach((item)=>{
            if(item.id===id){
                item.value=value;
                return;
            }
        });*/
        this.setState({
            list : list
        });
    }

    handleItemClick(id,e,type){            //点击item上的两个按钮时触发
        let list = this.state.list;
        let activeCounter=this.state.activeCounter;
        if(/*e.target.type==='checkbox'*/ type==='checkbox'){   //点击单选框触发
            /*let isChecked=e.target.checked;*/
            let isChecked=e.target.getAttribute('data-checked');  //得到的是个字符串，我日！！！！！！！
            for (let i = 0; i <= list.length; i++) {
                if (list[i].id === id) {
                    /*console.log(isChecked);*/
                    //注意这里和使用内置的checkbox时写法稍有区别。


                    /*-----这是用内置checkbox的写法-------------
                    isChecked?--activeCounter:activeCounter++;
                    list[i].completed=isChecked;  //勾选时减一没勾选加一
                    list[i].active=!isChecked;
                     -----这是用内置checkbox的写法-------------
                    */


                    //下面是自定义checkbox的写法         原因是自定义的checkbox,点击时传过来的是自定的data-checked，传过来之前它的值并没有发生变化，需要我们手动改变
                    //而内置的checkbox,你点击之后checked马上就变了，传过来的是变了之后的checked.比如初始点击时，data-checked是false,而内置的checkbox的checked为true。
                    console.log('------------------------------'+activeCounter);
                    console.log('------------------------------'+isChecked);
                    isChecked==='true' ? (activeCounter++) :(activeCounter--);
                    console.log('------------------------------'+activeCounter);
                    /*list[i].completed=!isChecked;
                    list[i].active=isChecked;*/
                    list[i].completed=! list[i].completed;
                    list[i].active=!list[i].active;
                    console.log('------------------------------'+isChecked);
                    break;
                }
            }
        }else {      //item删除按钮处理事件
            for (let i = 0; i <= list.length; i++) {
                if (list[i].id === id) {
                    list[i].active ? activeCounter-- : null;
                    list.splice(i, 1)
                    break;
                }
            }
        }
        this.setState({
            list : list,
            activeCounter : activeCounter
        });
    }
 /*   showNodesLength(length) {
        this.setState({nodesLength: length});
    }*/
    handleControlBarClick(e){                  //点击控制栏按钮时触发
        /*let controlSet=this.state.controlSet*/;
       // let counter=this.state.counter;
        let status=this.state.status;
        if(e.target.value==='showAll'){
            /*controlSet.showAll=true;
            controlSet.showActive=false;
            controlSet.showCompleted=false;*/
           // counter=this.state.list.length;
            status='showAll';
        }else if(e.target.value==='showActive'){
            /*controlSet.showActive=true;
            controlSet.showAll=false;
            controlSet.showCompleted=false;*/
           // counter=this.state.activeCounter;
            status='showActive';
        }else if(e.target.value==='showCompleted'){
          /*  controlSet.showCompleted=true;
            controlSet.showAll=false;
            controlSet.showActive=false;*/
            //ounter=this.state.list.length-this.state.activeCounter;
            status='showCompleted';
        }
        this.setState({
            /*controlSet: controlSet,*/
            //counter :counter,
            status : status
        });
    }

    handleClearCompleted() {             //清除Completed item时触发
        let list = this.state.list;
        let temp=[];
        for (let i = 0; i < list.length; i++) {
            if (list[i].completed) {
                continue;
            }
            temp.push(list[i]);
        }
        this.setState({
            list :temp
        });
    }

    handleItemListDisplay(iconStatus) {
        this.setState({listStatus: iconStatus});
    }

    render(){
        //console.log(this.state.list);
        //console.log('render --todomvc');
        let status=this.state.status;
        let list =this.state.list;
        let activeCounter=this.state.activeCounter;
        let counter=(status==='showAll')? list.length :(status==='showActive' ? activeCounter : list.length-activeCounter);
        let activeItems=[];    //优化了status判断，在render方法里面判断而不是传到组件ItemList之后判断
        let completedItems=[];
        list.forEach((item)=>{
            item.active?activeItems.push(item):completedItems.push(item);
        });
        list=(status==='showActive')? activeItems :(status==='showCompleted' ? completedItems : list);
        return(
            <div>
                <Input  onHandleKeyDown={this.handleKeyDown} onItemListDisplay={this.handleItemListDisplay}/>
                <ItemList list={list} onItemChange={this.handleItemChange} onHandleItemClick={this.handleItemClick}
                          /*controlSet={this.state.controlSet}*/ status={status} listStatus={this.state.listStatus}/>
                <ControlBar counter={counter} onControlBarClick={this.handleControlBarClick} onClearCompleted={this.handleClearCompleted} />
            </div>
        );
    }
}