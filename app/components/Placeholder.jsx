const Placeholder = ({ component, height = 'auto', width = 'auto', marginTop = '20px', padding = '30px', marginBottom = '20px' }) => {
    return (
        <div
            style={{
                background: 'var(--p-color-border-interactive-subdued)',
                height: height,
                width: width,
                borderRadius: 'inherit',
            }}
        >
            <div
                style={{
                    color: 'var(--p-color-text)',
                    marginTop: marginTop,
                    marginBottom: marginBottom,
                    padding: padding
                }}
            >
                {component}
            </div>
        </div>
    );
};

export default Placeholder