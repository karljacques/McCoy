import './style.css';

class ComponentRender {
    public static component(): Element {
        const element = document.createElement('div');

        element.innerHTML = 'Hello Webpack Typey-boi';

        return element;
    }
}


document.body.appendChild(ComponentRender.component());