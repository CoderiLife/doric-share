import { Panel, Group, vlayout, layoutConfig, Gravity, text, Text, Color, navbar, ViewModel, ViewHolder, VMPanel } from "doric";

class TabDemoModel {

}

class TabDemoView extends ViewHolder {
    build(root: Group) {

    }
}

class TabDemoVM extends ViewModel<TabDemoModel, TabDemoView> {
    onAttached(s: TabDemoModel, vh: TabDemoView) {

    }

    onBind(s: TabDemoModel, vh: TabDemoView) {

    }
}

@Entry
export class TabDemoPanel extends VMPanel<TabDemoModel, TabDemoView> {
    getViewHolderClass() {
        return TabDemoView
    }

    getViewModelClass() {
        return TabDemoVM
    }

    getState(): TabDemoModel {
        return {

        }
    }

    onShow() {
        navbar(context).setTitle("tab-layout")
    }
}