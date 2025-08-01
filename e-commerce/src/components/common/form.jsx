import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../ui/select";
import { Textarea } from "../ui/textarea";

function CommonForm({
  isFormValid = () => true,
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderItemByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || ''

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value= {value}
            onChange= {event=> setFormData({
              ...formData,
              [getControlItem.name] : event.target.value
            })}
          />
        );
        break;

      case "select":
        element = (
          <Select onValueChange={(value) => setFormData({
            ...formData,
            [getControlItem.name]: value
          })} value={value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;


        case "textarea":
        element = (
          <Textarea
            name= {getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange= {event=> setFormData({
              ...formData,
              [getControlItem.name] : event.target.value
            })}
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            onChange= {event=> setFormData({
              ...formData,
              [getControlItem.name] : event.target.value
            })}
          />
        );
        break;
    }

    return element;
  }

  return (
    <form autoComplete="off" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid-full gap-1.5" key={controlItem.name}>
            <label className="mb-1">{controlItem.label}</label>
            {renderItemByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button 
      type="submit" 
      disabled={isBtnDisabled}
      className={`mt-2 w-full ${isBtnDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>{buttonText || 'Submit'}</Button>
    </form>
  );
}

export default CommonForm;
