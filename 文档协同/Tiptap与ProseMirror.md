## 常见产品级富文本编辑器对比

要自己从0开始实现一个产品级的富文本编辑器是一件非常复杂的事情，要遇到很多问题，所以一般情况下，我们都是站在巨人的肩膀上去做这件事情，要么直接用现成的，要么在别人已有的框架上再进行2次开发。

以下是当前主流常见富文本编辑器的特性对比：

| 编辑器             | 核心语言                | 体积 | 可扩展性 | 协同支持        | 移动支持 | 使用场景                     |
| ------------------ | ----------------------- | ---- | -------- | --------------- | -------- | ---------------------------- |
| **Tiptap**         | Vue/React + ProseMirror | 中   | ⭐⭐⭐⭐     | ⭐⭐⭐⭐ (支持 yjs) | ⭐⭐⭐      | 自定义能力强，适合二次开发   |
| **ProseMirror**    | 原生 JS                 | 中   | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐            | ⭐⭐⭐      | 编辑器内核，基础构建         |
| **Slate.js**       | React                   | 中   | ⭐⭐⭐⭐     | ⭐⭐⭐             | ⭐⭐⭐      | 完全自定义的编辑体验         |
| **Quill**          | 原生 JS                 | 小   | ⭐⭐       | ⭐ (通过扩展)    | ⭐⭐⭐⭐     | 快速集成，简洁需求           |
| **CKEditor 5**     | 原生 JS                 | 大   | ⭐⭐⭐⭐     | ⭐⭐⭐⭐            | ⭐⭐⭐      | 商业产品，开箱即用           |
| **TinyMCE**        | 原生 JS                 | 大   | ⭐⭐⭐⭐     | ⭐⭐⭐             | ⭐⭐⭐⭐     | 类 Word 编辑体验             |
| **Lexical** (Meta) | React                   | 中   | ⭐⭐⭐⭐     | ⭐⭐              | ⭐⭐⭐      | 精细控制，适合 IM 和社交场景 |
| **Remirror**       | React + ProseMirror     | 中   | ⭐⭐⭐⭐     | ⭐⭐⭐             | ⭐⭐⭐      | 高度模块化，偏向工程性       |

**Tiptap** 是当前最适合“二次封装 + 协同编辑”的富文本解决方案：

| 优势                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| ✅ **构建于 ProseMirror**  | 拥有强大的文档模型能力（树形 AST + 标记系统）                |
| ✅ **现代框架支持**        | 官方支持 **Vue 3** 和 **React**，适合你已有的技术栈          |
| ✅ **插件体系强大**        | 丰富的 Extension 插件，可自由定制 schema、commands、menus、nodeView 等 |
| ✅ **支持协同编辑（Yjs）** | 内置对 Yjs 的适配，实时同步光标位置、内容、Undo 操作         |
| ✅ **社区活跃+文档优秀**   | 开源社区不断活跃，文档清晰、易上手                           |
| ✅ **丰富的 UI 生态**      | 可接入 Bubble Menu、Floating Menu、History、Placeholder 等扩展 |

其他产品的一些劣势：

| 框架           | 不推荐理由                                                   |
| -------------- | ------------------------------------------------------------ |
| **CKEditor 5** | 商业限制较多，协同功能需订阅官方的 Collaboration Server（不适合深度二开） |
| **Slate.js**   | 协同难度大，需要自己构建 CRDT 或 OT 算法支持，文档结构不天然适合多人同步 |
| **Lexical**    | 虽然结构现代，但协同能力非常初级，生态尚未完善（Meta 也未公开协同模块） |
| **Quill**      | 不支持 ProseMirror-like schema，结构扁平，不适合复杂文档与协同场景 |
| **Remirror**   | 可选，但生态和社区没有 Tiptap 活跃，插件数量偏少，二次开发资料较少 |

## Tiptap与ProseMirror的关系

你可以把 **[ProseMirror](https://prosemirror.net/)** 看作一个“编辑器引擎内核”，而 **[Tiptap](https://tiptap.dev/)** 则是基于这个内核做的“现代开发友好的封装层”。

如果我们要针对Tiptap进行开发，他们之间的关系如下图：

```text
┌─────────────────────────────┐
│         你开发的应用(封装)     │
└────────────▲────────────────┘
             │ 使用 Vue/React 写组件
┌────────────┴───────────────┐
│          Tiptap						 │ ← ★你主要和它打交道（开发友好）★
│(基于 ProseMirror 的封装)		 	│
│ - Vue/React 组件化接口			  │
│ - 插件注册机制（Extensions）  │
│ - 更现代的 API               │
└────────────▲───────────────┘
             │ 使用 ProseMirror 提供的底层能力
┌────────────┴───────────────┐
│        ProseMirror				 │ ← ★底层编辑引擎（功能强但复杂）★
│ - 文档状态建模(Schema/Node)	 │
│ - Selection/Cursor/Keymap  │
│ - Transaction 操作系统      │
│ - 插件机制（Plugins）        │
└────────────────────────────┘

```

总结来说：

- **ProseMirror** 是一个功能极强、抽象层级非常低的富文本“操作系统”。
- **Tiptap** 是为开发者构建的“现代 UI 框架”，帮你把复杂的 ProseMirror 变得好用好扩展。

如果我们要写自己的富文本库，可以用 **Tiptap** 落地，有兴趣有时间再深入 **ProseMirror** 探原理。

而且，Tiptap也可以非常方便的与文档协同库yjs进行组合开发。

**Tiptap + Yjs 的协作关系图**

```text
┌────────────────────────────┐
│        React / Vue         │ ◄───── 你的组件层（展示 + 操作）
│     <EditorContent />      │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│         Tiptap Editor      │ ◄───── Tiptap 的编辑器实例，封装 ProseMirror
│   schema / commands / UI   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│     ProseMirror 文档模型    │ ◄───── 真正的数据结构：Node、Mark、Transaction
└────────────┬───────────────┘
             │
     双向绑定（state 同步）
             ▼
┌────────────────────────────┐
│        Yjs 文档(Y.Doc)      │ ◄───── CRDT 数据结构
│  y-prosemirror 插件连接器    │
└────────────┬───────────────┘
             │
     广播/接收文档更新
             ▼
┌────────────────────────────┐
│    y-websocket(or your own)│ ◄───── 网络同步层，可替换为 y-webrtc、Liveblocks 等
│      Awareness 状态广播     │
└────────────────────────────┘

```

## Tiptap的使用

**Tiptap**给我提供了诸如`@tiptap/starter-kit`这样的现成的组件，可以[直接食用](https://v2.tiptap.dev/docs/editor/getting-started/install/react)，但是如果我们想要进行二次开发，还需要稍微对其底层原理有一定的了解。

### 引入

比如我们现在想用，当然优先导入Tiptap相关的包：

```typescript
"dependencies": {
  ......
  "@tiptap/core": "2.25.0",
  "@tiptap/react":"2.25.0"
},
```

> **注意：**
>
> 最新的Tiptap刚刚更新(2025.7月)了3.x的版本，内容有很多更新，为了防止不兼容的情况，使用2.x的版本

然后我们在组件中试着直接引入组件`EditorProvider`。

`components/Editor/index.tsx`

```react
import { EditorProvider } from "@tiptap/react";

export function Editor() { 
  return <EditorProvider />
}
```

然后在App.tsx组件中引入。虽然当前代码没报错。但是当我们运行访问，就会报出如下错误：

```text
Uncaught RangeError: Schema is missing its top node type ('doc')
```

其实就是提示我们需要去创建`上层节点doc`

### 节点插件处理

根据我们上面的关系图，node节点这种数据模型，其实是[ProseMirror提供](https://prosemirror.net/docs/guide/#doc)的，所以针对节点，我们就需要根据[PromseMirror对节点的处理](https://prosemirror.net/docs/guide/#schema)，来进行创建。

`Tiptap`所有的节点或者装饰(标记Marks)都是以[插件](https://v2.tiptap.dev/docs/editor/extensions/overview)的方式进行处理的，我们可以定义一个`doc插件`

> 注意：这里完全可以对照着我们之前的代码，创建的数据结构`jsonContent`来进行理解

`components/extensions/Document.ts`

```typescript
import { Node } from "@tiptap/core";

export const Document = Node.create({
  name: "document", // 节点名称
  topNode: true, // 表示这是顶层节点
  content: "block+", // +的意思是：表示至少有一个block节点
});
```

然后这个extensions插件，就可以放入到EditorProvider组件中了：

```typescript
import { EditorProvider } from "@tiptap/react";
import { Document } from "../extensions/Document";

export function Editor() { 
  return <EditorProvider extensions={[Document]} />
}
```

但是，现在还是报错，只是换了一种错误：

```text
Uncaught RangeError: Every schema needs a 'text' type
```

着很明显了，又说没有text，那我们再创建一个text即可。

`components/extensions/Text.ts`

```typescript
import { Node } from "@tiptap/core";

export const Text = Node.create({
  name: "text", // 节点名称
  group: "inline", // 表示这是一个行内节点
  inline: true, // 表示这是一个行内节点
});
```

然后引用：

```typescript
import { EditorProvider } from "@tiptap/react";
import { Document } from "../extensions/Document";
import { Text } from "../extensions/Text";

export function Editor() { 
  return <EditorProvider extensions={[Document, Text]} />
}
```

但是现在这样运行之后还是报错：

```text
Uncaught SyntaxError: No node type or group 'block' found (in content expression 'block+')
```

这个原因其实也很好理解，我们创建Document的时候，声明了`content: "block+"`，也就是至少需要一个块级标签，那我们对照着之前`jsonContent`这个数据来，我们不是还创建了一个`paragraph`属性，其实也就是一个`p标签`。所以，我们应该把文本放入到p标签中

```typescript
import { Node } from "@tiptap/core";

export const Paragraph = Node.create({
  name: "paragraph", // 节点名称
  group: "block", // 表示这是一个块级节点
  content: "inline*", // *的意思是：表示可以有0个或多个行内节点
  defining: true, // 表示这是一个定义节点
  
  // 当我们在编辑器中输入内容时，如何将这个节点转换为JSON格式
  parseHTML() {
    return [
      {
        tag: "p", // HTML标签
      },
    ];
  },
  // 当我们从JSON格式转换为HTML时，如何渲染这个节点
  renderHTML({ HTMLAttributes }) {
    return ["p", HTMLAttributes, 0]; // 返回HTML结构
  }
});
```

然后引用：

```typescript
import { EditorProvider } from "@tiptap/react";
import { Document } from "../extensions/Document";
import { Text } from "../extensions/Text";
import { Paragraph } from "../extensions/Paragraph";

export function Editor() { 
  return <EditorProvider extensions={[Document, Paragraph, Text]} />
}
```

这样至少页面不再报错了。

### Bold标记处理

现在虽然我们可以编辑了，原来可以通过快捷键直接加粗的这些操作都没有了，我们现在要做，就需要自己加入相应的操作。加粗操作，我们可以以插件extensions的方式加入进去.

`components/extensions/Bold.ts`

```typescript
import { Mark, mergeAttributes } from "@tiptap/core";

export const Bold = Mark.create({
  name: "bold", // 节点名称
  parseHTML() {
    return [
      {
        tag: "strong", // strong 标签
      },
      {
        tag: "b", // 也支持 <b> 标签
        // 如果 <b> 标签的 font-weight 不是 normal，则认为它是粗体
        getAttrs: node => node.style.fontWeight !== "normal" && null, 
      },
      {
        style: 'font-weight=400',
        clearMark: mark => mark.type.name === this.name,
      },
      {
        style: "font-weight", // 也支持 font-weight 样式
        // 通过正则的方式匹配,font-weight 的值是bold/bolder/或者在500-900之间都应该是粗体
        getAttrs: value => /^(bold|bolder|[5-9]\d{2,})$/.test(value) && null,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    // mergeAttributes 合并默认的 HTMLAttributes 和传入的 HTMLAttributes
    return ['strong', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
```

调用：

```typescript
import { EditorProvider } from "@tiptap/react";
import { Document } from "../extensions/Document";
import { Text } from "../extensions/Text";
import { Paragraph } from "../extensions/Paragraph";
import { Bold } from "../extensions/Bold";

export function Editor() { 
  return <EditorProvider extensions={[Document, Paragraph, Text, Bold]}/>
}
```

但是现在，还是没有事件，或者快捷键可以处理加粗的操作，所以我们还需要手动的去**处理事件和快捷键**

当然，有事件至少需要加入相应的按钮，可以在Editor中进行处理：

```typescript
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { Document } from "../extensions/Document";
import { Text } from "../extensions/Text";
import { Paragraph } from "../extensions/Paragraph";
import { Bold } from "../extensions/Bold";

const Toolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null
  }
  const bold = () => {
    editor.chain().focus().toggleBold().run();
  };

  return (
    <div>
      <button onClick={bold}>加粗</button>
    </div>
  )
};

export function Editor() {
  return (
    <EditorProvider extensions={[Document, Paragraph, Text, Bold]}>
      <Toolbar />
    </EditorProvider>
  );
}
```

只不过我们现在这样写了之后，其实编辑器已经在报错，toggleBold()这个方法不存在，这主要是由于Bold是插件的形式出现的，并没有定义在核心的方法里面，所以无论是类型还是命令处理，我们都需要在Bold中自行进行定义

```typescript
import { Mark, mergeAttributes } from "@tiptap/core";

// 定义 bold 的命令类型
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bold: {
      setBold: () => ReturnType;
      toggleBold: () => ReturnType;
      unsetBold: () => ReturnType;
    };
  }
}

export const Bold = Mark.create({
  name: "bold", // 节点名称
  parseHTML() {
    return [
      {
        tag: "strong", // strong 标签
      },
      {
        tag: "b", // 也支持 <b> 标签
        // 如果 <b> 标签的 font-weight 不是 normal，则认为它是粗体
        getAttrs: (node) => node.style.fontWeight !== "normal" && null,
      },
      {
        style: "font-weight=400",
        clearMark: (mark) => mark.type.name === this.name,
      },
      {
        style: "font-weight", // 也支持 font-weight 样式
        // 通过正则的方式匹配,font-weight 的值是bold/bolder/或者在500-900之间都应该是粗体
        getAttrs: (value) => /^(bold|bolder|[5-9]\d{2,})$/.test(value) && null,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    // mergeAttributes 合并默认的 HTMLAttributes 和传入的 HTMLAttributes
    return [
      "strong",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  // 添加加粗的相关命令
  // 注意这些命令其实并没有类型，我们需要自己去定义类型，不然会有TS报错
  addCommands() {
    return {
      toggleBold:
        () =>
        ({ commands }) => {
          // 使用 commands.toggleMark 来切换粗体标记
          return commands.toggleMark(this.name);
        },
      setBold:
        () =>
        ({ commands }) => {
          // 使用 commands.setMark 来设置粗体标记
          return commands.setMark(this.name);
        },
      unsetBold:
        () =>
        ({ commands }) => {
          // 使用 commands.unsetMark 来取消粗体标记
          return commands.unsetMark(this.name);
        },
    };
  },
});

```

这样，在界面的点击事件就可以起作用了。

当然，我还需要使用快捷键，比如使用`Ctrl+B`快捷键进行加粗的切换操作，这当然需要我们在**Bold里面加入快捷键**相应的操作

```typescript
// 添加快捷键
  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(), // Mac 上是 Command 键，Windows 上是 Ctrl 键
      "Mod-B": () => this.editor.commands.toggleBold(), // 大写的 B 也可以切换粗体
    };
  },
```

### Italic引入

其实这些在TipTap中都以extensions插件放入进行的引入，比如我们现在写的Bold，可以直接在[github上查看源码](https://github.com/ueberdosis/tiptap/blob/v2.25.0/packages/extension-bold/src/bold.ts)

也就是说如果我们要使用其他的内容，也可以直接引入TipTap提供给我们的相关插件即可，比如，我们可以直接引入斜体(extension-italic)相关内容：

```typescript
"dependencies": {
  ......
  "@tiptap/extension-italic": "2.25.0"
},
```

直接在Editor中使用：

```typescript
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { Document } from "../extensions/Document";
import { Text } from "../extensions/Text";
import { Paragraph } from "../extensions/Paragraph";
import { Bold } from "../extensions/Bold";
import Italic from "@tiptap/extension-italic";

const Toolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null
  }
  const bold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const italic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  return (
    <div>
      <button onClick={bold}>加粗</button>
      <button onClick={italic}>斜体</button>
    </div>
  )
};

export function Editor() {
  return (
    <EditorProvider extensions={[Document, Paragraph, Text, Bold, Italic]}>
      <Toolbar />
    </EditorProvider>
  );
}

```

### 初始化内容

我们当然也能加入初始化内容

```typescript
export function Editor() {
  const content = "<p>您好，<strong>Hello</strong> <em>World</em></p>";
  return (
    <EditorProvider content={content} extensions={[Document, Paragraph, Text, Bold, Italic]}>
      <Toolbar />
    </EditorProvider>
  );
}
```

这样界面上就能显示初始化的内容

实际上，content的内容会被解析为json格式，并且和我们extensions中内容要进行对应，也就是extensions中没有的，其实是解析不了的。

比如，加入`pre`标签内容

```typescript
const content = "<p>您好，<strong>Hello</strong><em>World</em></p><pre>console.log('Hello World')</pre>";
```

界面上并不会对`pre`内容进行解析，我们需要加入相应的插件，比如我们自己简单加入pre的插件

`components/extensions/Code.ts`

```typescript
import { mergeAttributes, Node } from "@tiptap/core";

export const Code = Node.create({
  name: "code", // 节点名称
  group: "block", // 表示这是一个块级节点
  content: "inline*", // *的意思是：表示可以有0个或多个行内节点
  
  // 当我们在编辑器中输入内容时，如何将这个节点转换为JSON格式
  parseHTML() {
    return [
      {
        tag: "pre", // HTML标签
      },
    ];
  },
  // 当我们从JSON格式转换为HTML时，如何渲染这个节点
  renderHTML({ HTMLAttributes }) {
    return ["pre", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]; // 返回HTML结构
  }
});
```

然后在Editor中引入：

```react
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { Document } from "../extensions/Document";
import { Text } from "../extensions/Text";
import { Paragraph } from "../extensions/Paragraph";
import { Bold } from "../extensions/Bold";
import Italic from "@tiptap/extension-italic";
import { Code } from "../extensions/Code";

const Toolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null
  }
  const bold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const italic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  return (
    <div>
      <button onClick={bold}>加粗</button>
      <button onClick={italic}>斜体</button>
    </div>
  )
};

export function Editor() {
  const content = "<p>您好，<strong>Hello</strong><em>World</em></p><pre>console.log('Hello World')</pre>";
  
  return (
    <EditorProvider content={content} extensions={[Document, Paragraph, Text, Bold, Italic, Code]}>
      <Toolbar />
    </EditorProvider>
  );
}

```

现在`pre`标签就能在界面正确显示了，而且，我们说content字符串内容最后实际上会转换成JSON内容，其实就是和我们最开始讲解的JSON格式是一样的。我们直接使用JSON格式来看看。

```react
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { Document } from "../extensions/Document";
import { Text } from "../extensions/Text";
import { Paragraph } from "../extensions/Paragraph";
import { Bold } from "../extensions/Bold";
import Italic from "@tiptap/extension-italic";
import { Code } from "../extensions/Code";

const Toolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null
  }
  const bold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const italic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  return (
    <div>
      <button onClick={bold}>加粗</button>
      <button onClick={italic}>斜体</button>
    </div>
  )
};

export function Editor() {
  // const content = "<p>您好，<strong>Hello</strong><em>World</em></p><pre>console.log('Hello World')</pre>";
  
  const content = {
    type: "document",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "您好，",
          },
          {
            type: "text",
            text: "Hello",
            marks: [{ type: "bold" }],
          },
          {
            type: "text",
            text: "World",
            marks: [{ type: "italic" }],
          },
        ],
      },
      {
        type: "code",
        content: [
          {
            type: "text",
            text: "console.log('Hello World')",
          },
        ],
      },
    ],
  }
  return (
    <EditorProvider content={content} extensions={[Document, Paragraph, Text, Bold, Italic, Code]}>
      <Toolbar />
    </EditorProvider>
  );
}

```

### 自定义节点

由于我们可以通过插件的方式定义节点，同样，Tiptap也帮我们提供了多种自定义组件的形式，比如[原有extension节点上的继承](https://v2.tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing)，[完全创建新的插件扩展](https://v2.tiptap.dev/docs/editor/extensions/custom-extensions/create-new)，还可以[将框架组件加入到节点中](https://v2.tiptap.dev/docs/editor/extensions/custom-extensions/node-views/react)

```typescript
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { TagComponent } from "./TagComponent.tsx";

export default Node.create({
  name: "reactComponent",
  group: "block",
  // atom: true, 表示这是一个原子节点，不能被拆分或合并
  atom: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "react-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["react-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TagComponent);
  },
});

```

我们需要自己创建React组件`TagComponent`

```react
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

export function TagComponent(props: ReactNodeViewProps<HTMLLabelElement>) {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    });
  };

  return (
    <NodeViewWrapper className="react-component">
      <label>React Component</label>

      <div className="content">
        <button onClick={increase}>
          按钮点击 {props.node.attrs.count} 次.
        </button>
      </div>
    </NodeViewWrapper>
  );
}

```

然后我们自定的`react-component`插件，就可以在Editor中进行引入了

```tsx
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { Document } from "../extensions/Document";
import { Text } from "../extensions/Text";
import { Paragraph } from "../extensions/Paragraph";
import { Bold } from "../extensions/Bold";
import Italic from "@tiptap/extension-italic";
import { Code } from "../extensions/Code";
import TagExtension from '../extensions/TagExtension'

const Toolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null
  }
  const bold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const italic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  return (
    <div>
      <button onClick={bold}>加粗</button>
      <button onClick={italic}>斜体</button>
    </div>
  )
};

export function Editor() {
  const content = `<p>您好，<strong>Hello</strong><em>World</em></p>
  <pre>console.log('Hello World')</pre>
  <react-component count="0"></react-component>
  `;
  return (
    <EditorProvider content={content} extensions={[Document, Paragraph, Text, Bold, Italic, Code, TagExtension]}>
      <Toolbar />
    </EditorProvider>
  );
}

```

加入相应的css，为了方便这里直接使用的scss，当然vite需要先安装sass。`pnpm add sass -D`

直接在根目录下创建`styles.scss`文件

```scss
/* Base HTML and global element styles*/
:root {
  --white: #fff;
  --black: #2e2b29;
  --black-contrast: #110f0e;
  --gray-1: rgba(61, 37, 20, 0.05);
  --gray-2: rgba(61, 37, 20, 0.08);
  --gray-3: rgba(61, 37, 20, 0.12);
  --gray-4: rgba(53, 38, 28, 0.3);
  --gray-5: rgba(28, 25, 23, 0.6);
  --green: #22c55e;
  --purple: #6a00f5;
  --purple-contrast: #5800cc;
  --purple-light: rgba(88, 5, 255, 0.05);
  --yellow-contrast: #facc15;
  --yellow: rgba(250, 204, 21, 0.4);
  --yellow-light: #fffae5;
  --red: #ff5c33;
  --red-light: #ffebe5;
  --shadow: 0px 12px 33px 0px rgba(0, 0, 0, 0.06),
    0px 3.618px 9.949px 0px rgba(0, 0, 0, 0.04);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Color Emoji";
  line-height: 1.5;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 25rem;
  margin: 0;
}

:first-child {
  margin-top: 0;
}

.tiptap {
  caret-color: var(--purple);
  margin: 1.5rem;

  &:focus {
    outline: none;
  }
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  height: 14px;
  width: 14px;
}

::-webkit-scrollbar-track {
  background-clip: padding-box;
  background-color: transparent;
  border: 4px solid transparent;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background-clip: padding-box;
  background-color: rgba(0, 0, 0, 0);
  border: 4px solid rgba(0, 0, 0, 0);
  border-radius: 8px;
}

:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.15);
}

::-webkit-scrollbar-button {
  display: none;
  height: 0;
  width: 0;
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}

/* Specific element and component styles */
button,
input,
select,
textarea {
  background: var(--gray-2);
  border-radius: 0.5rem;
  border: none;
  color: var(--black);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.15;
  margin: none;
  padding: 0.375rem 0.625rem;
  transition: all 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);

  &:hover {
    background-color: var(--gray-3);
    color: var(--black-contrast);
  }

  &[disabled] {
    background: var(--gray-1);
    color: var(--gray-4);
  }

  &:checked {
    accent-color: var(--purple);
  }

  &.primary {
    background: var(--black);
    color: var(--white);

    &:hover {
      background-color: var(--black-contrast);
    }

    &[disabled] {
      background: var(--gray-1);
      color: var(--gray-4);
    }
  }

  &.is-active {
    background: var(--purple);
    color: var(--white);

    &:hover {
      background-color: var(--purple-contrast);
      color: var(--white);
    }
  }
}

button:not([disabled]),
select:not([disabled]) {
  cursor: pointer;
}

input[type="text"],
textarea {
  background-color: unset;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
  color: var(--black);

  &::placeholder {
    color: var(--gray-4);
  }

  &:hover {
    background-color: unset;
    border-color: var(--gray-4);
  }

  &:focus-visible,
  &:focus {
    border-color: var(--purple);
    outline: none;
  }
}

select {
  /* reset */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="Gray" d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.1rem center;
  background-size: 1.25rem 1.25rem;
  padding-right: 1.25rem;

  &:focus {
    outline: 0;
  }
}

form {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hint {
  align-items: center;
  background-color: var(--yellow-light);
  border-radius: 0.5rem;
  border: 1px solid var(--gray-2);
  display: flex;
  flex-direction: row;
  font-size: 0.75rem;
  gap: 0.25rem;
  line-height: 1.15;
  padding: 0.3rem 0.5rem;

  &.purple-spinner,
  &.error {
    justify-content: center;
    text-align: center;
    width: 100%;
  }

  .badge {
    background-color: var(--gray-1);
    border: 1px solid var(--gray-3);
    border-radius: 2rem;
    color: var(--gray-5);
    font-size: 0.625rem;
    font-weight: 700;
    line-height: 1;
    padding: 0.25rem 0.5rem;
  }

  &.purple-spinner {
    background-color: var(--purple-light);

    &::after {
      content: "";
      background-image: url("data:image/svg+xml;utf8,<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='28px' height='30px' viewBox='0 0 24 30' style='enable-background:new 0 0 50 50;' xml:space='preserve'><rect x='0' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0' dur='0.6s' repeatCount='indefinite'/></rect><rect x='10' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0.2s' dur='0.6s' repeatCount='indefinite'/></rect><rect x='20' y='10' width='6' height='10' fill='%236A00F5' rx='3' ry='3'><animateTransform attributeType='xml' attributeName='transform' type='translate' values='0 0; 0 5; 0 -5; 0 0' begin='0.4s' dur='0.6s' repeatCount='indefinite'/></rect></svg>");
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      height: 1rem;
      width: 1rem;
    }
  }

  &.error {
    background-color: var(--red-light);
  }
}

.label,
.label-small,
.label-large {
  color: var(--black);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.15;
}

.label-small {
  color: var(--gray-5);
  font-size: 0.75rem;
  font-weight: 400;
}

.label-large {
  font-size: 0.875rem;
  font-weight: 700;
}

hr {
  border: none;
  border-top: 1px solid var(--gray-3);
  margin: 0;
  width: 100%;
}

kbd {
  background-color: var(--gray-2);
  border: 1px solid var(--gray-2);
  border-radius: 0.25rem;
  font-size: 0.6rem;
  line-height: 1.15;
  padding: 0.1rem 0.25rem;
  text-transform: uppercase;
}

/* Layout and structure */
#app,
.container {
  display: flex;
  flex-direction: column;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.control-group {
  align-items: flex-start;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;

  .sticky {
    position: sticky;
    top: 0;
  }
}

[data-node-view-wrapper] > .control-group {
  padding: 0;
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  width: 100%;
}

.switch-group {
  align-items: center;
  background: var(--gray-2);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 0 1 auto;
  justify-content: flex-start;
  padding: 0.125rem;

  label {
    align-items: center;
    border-radius: 0.375rem;
    color: var(--gray-5);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-size: 0.75rem;
    font-weight: 500;
    gap: 0.25rem;
    line-height: 1.15;
    min-height: 1.5rem;
    padding: 0 0.375rem;
    transition: all 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);

    &:has(input:checked) {
      background-color: var(--white);
      color: var(--black-contrast);
    }

    &:hover {
      color: var(--black);
    }

    input {
      display: none;
      margin: unset;
    }
  }
}

.output-group {
  background-color: var(--gray-1);
  display: flex;
  flex-direction: column;
  font-family: "JetBrainsMono", monospace;
  font-size: 0.75rem;
  gap: 1rem;
  margin-top: 2.5rem;
  padding: 1.5rem;

  label {
    color: var(--black);
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.15;
  }
}
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: "JetBrainsMono", monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }

  /* React component */
  .react-component {
    background-color: var(--purple-light);
    border: 2px solid var(--purple);
    border-radius: 0.5rem;
    margin: 2rem 0;
    position: relative;

    label {
      background-color: var(--purple);
      border-radius: 0 0 0.5rem 0;
      color: var(--white);
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0.25rem 0.5rem;
      position: absolute;
      top: 0;
    }

    .content {
      margin-top: 1.5rem;
      padding: 1rem;
    }
  }
}

```

最后在`main.tsx`中引入一下`styles.scss`文件就行了