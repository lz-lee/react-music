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