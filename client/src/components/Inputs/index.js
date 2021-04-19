export const InputControl = (params) => {
  return (
    <div className="form-group">
      <label className="sr-only" htmlFor={params.nid}>
        {params.placeholder}
      </label>
      <input
        id={params.nid}
        placeholder={params.placeholder}
        required="required"
        name={params.name}
        className={
          params.customClass
            ? `form-control ${params.customClass}`
            : 'form-control text'
        }
        type={params.type ? params.type : 'text'}
        onChange={params.handle.handleChange}
        onBlur={params.handle.handleBlur}
        value={params.value ? params.value : params.handle[params.name]}
      />
    </div>
  );
};

export const SelectControl = (params) => {
  return (
    <div className="form-group">
      <select
        className="form-control"
        name={params.name}
        onChange={params.handle.handleChange}
        onBlur={params.handle.handleBlur}
        value={params.handle.values[params.name]}
      >
        {params.children}
      </select>
    </div>
  );
};

export const CheckBoxControl = (params) => {
  return (
    <div className="tabs-notify-check-styles">
      <span className="tabs-notify-check-span-toggle">{params.desc}</span>
      <label className="switch tabs-notify-checkbox-align-toggle">
        <input
          type="checkbox"
          name={params.name}
          onChange={params.handle.handleChange}
          onBlur={params.handle.handleBlur}
          checked={params.handle[params.name] ? 'checked' : ''}
        />
        <div className="slider round"></div>
      </label>
    </div>
  );
};

export const InputForControl = (params) => {
  return (
    <div className="form-group">
      <label
        style={params.size ? {fontSize: params.size} : {}}
        htmlFor={params.nid}
      >
        {params.text}
      </label>
      <input
        id={params.nid}
        placeholder={params.placeholder}
        required="required"
        name={params.name}
        className={
          params.customClass
            ? `form-control ${params.customClass}`
            : 'form-control text'
        }
        type={params.type ? params.type : 'text'}
        onChange={params.handle.handleChange}
        onBlur={params.handle.handleBlur}
        value={params.handle[params.name]}
      />
    </div>
  );
};
