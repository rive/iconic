# iconic

build svg icons that can be used in html, angular, react and vue.

## generate icons

install the package:

```
npm install --save-dev @rive/iconic
```

edit your `package.json`:

```json
{
    "scripts": {
        "build": "rive-iconic"
    }
}
```

then put some svg icon files in the root folder.

next, let's run:

```
npm run build
```

svg files will be optimized. js and json files with same base name will be generated,
which contains icon path and color information and can be imported directly into
any js project.

## use your icons

```jsx
import Icon from "foobar-react/icon";
import cross from "foobar-icons/cross";

<Icon data={cross} />;
```
