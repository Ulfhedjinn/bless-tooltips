(function(window, document) {
    const styles = `<style id='bless-tooltipstyle'>
    .tooltip-hidden {
        display: none;
        opacity: 0;
    }
    .tooltip-container {
        position: absolute;
        font-family: sans-serif;
        width: 230px;
        background-color: rgba(0,0,0,0.8);
        color: white;
        padding: 5px;
        font-size: 12px;
    }

    .tooltip-container .icon {
        float: left;
        width: 50px;
    }
    .tooltip-container .name { 
        float: left;
        width: 170px;
        margin: 5px;
        font-size: 14px;
        letter-spacing: 1;
        
    }
    .tooltip-container .clear {
        clear: both;
    }
    .tooltip-container .attributes { 
        margin-top: 15px;
    }
    .tooltip-container .attributes label {
        display: inline-block;
        width: 75px; 
    }
    .tooltip-container .description {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .tooltip-container .description dmg {
        color: #fd5246;
    }
    .tooltip-container .description link {
        cursor: pointer;
    }
    .tooltip-container .get-help a {
        margin-top: -10px;
        float: right;
        color: white;
        font-size: 11px;
        text-decoration: none;
    }
</style>`;
    const template = `
<div id='bless-tooltipjs' class="tooltip-container tooltip-hidden">
    <div class="icon">
        <img id='blessjs-icon' src="#" />
    </div>
    <div class="name"><span id='blessjs-name'></span></div>
    <div class="clear"></div>
    <div class="attributes">
        <div>
            <label>Casting: </label> <span id='blessjs-cast'></span>
        </div>
        <div>
            <label>Eff range: </label> <span id='blessjs-range'></span>m
        </div>
        <div>
            <label>Mana cost: </label> <span id='blessjs-cost'></span>    
        </div>
        <div>
            <label>Cooldown: </label> <span id='blessjs-cooldown'></span>   
        </div>
    </div>
    <div class="description"><span id='blessjs-description'></span></div>
    <!--<div class="get-help"><a href="#help">?</a></div>-->
</div>
`;
    const dataTemplate = `<script type="application/json" id='bless-tooltipdata'></script>`;

    var app = {};

    app.activeElement = null;
    app.tooltip = null;

    app.init = function init() {
        app.createTooltip();
        app.attachHandlers();
    }

    app.createTooltip = function createTooltip() {
        const tooltip = document.querySelector('#bless-tooltipjs');
        if (tooltip) {
            return console.log("[BlessJS] Tooltip already setup");
        }
        const tooltipData = document.querySelector('#bless-tooltipdata');
        if (tooltip) {
            return console.log("[BlessJS] Tooltip data already setup");
        }
        const tooltipStyle = document.querySelector('#bless-tooltipstyle');
        if (tooltip) {
            return console.log("[BlessJS] Tooltip data already setup");
        }

        document.querySelector('body').innerHTML += dataTemplate;
        app.fetchJSONData();

        document.querySelector('body').innerHTML += styles;

        document.querySelector('body').innerHTML += template;
        app.tooltip = document.querySelector('#bless-tooltipjs');
        if (!app.tooltip) {
            console.error("Unable to create tooltip!");
        }
    }
    app.fetchJSONData = function fetchJSONData() {
        fetch('https://rawgit.com/psykzz/bless-tooltips/master/spell-data.json')
            .then(res => {
                // I know this is silly i just want to throw an error here if it needs it, can always clean this up later.
                return res.json();
            })
            .then(data => {
                const tooltipData = document.querySelector('#bless-tooltipdata').innerHTML = JSON.stringify(data);
            });
    }

    app.attachHandlers = function attachHandlers() {
        const elements = document.querySelectorAll('[data-bless-spell]');
        elements.forEach(ele => {
            ele.addEventListener('mouseenter', (e) => {
                const {clientX, clientY, target} = e;

                const spell = target.getAttribute('data-bless-spell');
                const spellData = app.fetchSpellData(spell);

                app.showTooltip(spellData);
            });

            ele.addEventListener('mouseleave', () => {
                app.hideTooltip();
            });

            ele.addEventListener('mousemove', (e) => {
                const {clientX, clientY, target} = e;
                app.updateTooltip({clientX, clientY});
            })
        });

    }

    app.showTooltip = function showTooltip(data) {
        app.tooltip.classList.toggle('tooltip-hidden', false);

        var ele = document.getElementById;
        document.getElementById('blessjs-icon').setAttribute('src', data.icon);
        document.getElementById('blessjs-name').textContent = data.name;
        document.getElementById('blessjs-cast').parentElement.classList.toggle('tooltip-hidden', !data.attributes.cast);
        document.getElementById('blessjs-cast').textContent = data.attributes.cast;

        document.getElementById('blessjs-range').parentElement.classList.toggle('tooltip-hidden', !data.attributes.range);
        document.getElementById('blessjs-range').textContent = data.attributes.range;

        document.getElementById('blessjs-cost').parentElement.classList.toggle('tooltip-hidden', !data.attributes.cost);
        document.getElementById('blessjs-cost').textContent = data.attributes.cost;

        document.getElementById('blessjs-cooldown').parentElement.classList.toggle('tooltip-hidden', !data.attributes.cooldown);
        document.getElementById('blessjs-cooldown').textContent = data.attributes.cooldown;
        
        document.getElementById('blessjs-description').innerHTML = data.description;
    }

    app.hideTooltip = function hideTooltip() {
        app.tooltip.classList.toggle('tooltip-hidden', true);
    }

    app.updateTooltip = function updateTooltip(position) {
        app.tooltip.style.left = position.clientX + 5;
        app.tooltip.style.top = position.clientY + 5;
    }
    app.fetchSpellData  = function fetchSpellData (spellName) {
        const rawData = document.getElementById('bless-tooltipdata').textContent;
        if (!rawData) {
            return console.log("Unable to load bless data");
        }
        var jsonData = JSON.parse(rawData)

        return jsonData[spellName];
    }

    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    }, false);
})(window, document);