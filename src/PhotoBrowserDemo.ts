import { Panel, Group, vlayout, layoutConfig,slideItem, image, Slider,  slider, Gravity, text, Text, Color, navbar, ViewModel, ViewHolder, VMPanel, ScaleType, LayoutSpec, gravity } from "doric";

class PhotoBrowserDemoModel {
    current!: number
    source!: Array<{
        imageUrl: string,
        imgHeight: number,
        imgWidth: number
    }>
}

class PhotoBrowserDemoView extends ViewHolder {
    private pager!: Slider
    build(root: Group) {
        slider({
            layoutConfig: layoutConfig().most(),
        }).also(it => this.pager = it).in(root)
    }

    bind(s: PhotoBrowserDemoModel) {
        this.pager.also(it => {
            it.itemCount = s.source.length
            it.renderPage = (idx) => slideItem(
                image({
                    imageUrl: s.source[idx].imageUrl,
                    scaleType: ScaleType.ScaleAspectFit,
                    layoutConfig: layoutConfig().just().configAlignment(gravity().center()),
                    width: Environment.screenWidth,
                    height: s.source[idx].imgHeight / s.source[idx].imgWidth * Environment.screenWidth
                })
            )
        })
    }
}

class PhotoBrowserDemoVM extends ViewModel<PhotoBrowserDemoModel, PhotoBrowserDemoView> {
    onAttached(s: PhotoBrowserDemoModel, vh: PhotoBrowserDemoView) {

    }

    onBind(s: PhotoBrowserDemoModel, vh: PhotoBrowserDemoView) {
        vh.bind(s)
    }
}

@Entry
export class PhotoBrowserDemoPanel extends VMPanel<PhotoBrowserDemoModel, PhotoBrowserDemoView> {
    getViewHolderClass() {
        return PhotoBrowserDemoView
    }

    getViewModelClass() {
        return PhotoBrowserDemoVM
    }

    getState(): PhotoBrowserDemoModel {
        let model = this.getInitData() as PhotoBrowserDemoModel
        if (!model) {
            model = new PhotoBrowserDemoModel
            model.current = 0
            model.source = []
        }

        return model
    }

    onCreate() {
        navbar(context).setTitle('Photo Browser')
    }

    onShow() {

    }
}