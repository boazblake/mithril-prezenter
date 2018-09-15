import m from 'mithril'

const Presentation = ({ attrs }) => {
    return {
        view: () =>
            <div class="thumb-card card">
                <div class="slide-fields">
                    <div class="title slide-field">
                        {attrs.title}
                    </div>
                    <div className="button slide-field" onclick={() => attrs.select(attrs.id, attrs.name)}>
                        {attrs.icon}
                    </div>
                </div>
            </div>
    }
}

export default Presentation