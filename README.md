### 运行

- npm i

- npm start

### 知识点

#### 1、refs

- 获取 `refs`：以下方式均可以通过 `this.refs.input` 获取

    ```
    <input ref={input => this.input = input}>

    <input ref="input">

    ```

#### 2、生命周期执行顺序

> will mount (执行一次) 

> render

> did mount (执行一次) 

> will receive props

> should update

> will update

> render

> did update

 ![生命周期](./assets/lifecycle.png)


#### 3、`componentWillReceiveProps(nextProps)` 与 `shouldComponentUpdate(newProps, newState)` 

- 组件中的 `this.props` 与 这两个生命周期中的 `nextProps 、newProps` 是同一个引用
