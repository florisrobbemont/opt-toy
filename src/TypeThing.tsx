import * as React from "react"
import useUndo from "use-undo"
import { OPT512Maybe, BLANK_TYPE, parseCoinText, cleanCoinText } from "./Coin"
import { OPTypeBinaryForm } from "./OPTypeBinaryForm"
import { OPCodeInput } from "./OPCodeInput"
import { OP_Type } from "./OP_Type"
import { OPT512 } from "./OPT512"
import OPActivationTable from "./OPActivationTable"
import AOPActivationTable from "./AOPActivationTable"
import { betweenX } from "./between"

function OPTypeBinaryText({ type }: { type: OPT512Maybe }) {
  const opt = new OPT512(type)
  return <span>{opt.OP512}</span>
}

const SEPARATOR = `!`

const Spacer = () => <span style={{ flex: "1 1 0%" }} />

const History = props => (
  <div>
    <button
      key="undo"
      onClick={props.opTypeActions.undo}
      disabled={!props.opTypeActions.canUndo}
    >
      undo
    </button>
    <button
      key="redo"
      onClick={props.opTypeActions.redo}
      disabled={!props.opTypeActions.canRedo}
    >
      redo
    </button>
    <button
      key="reset"
      onClick={() =>
        props.opTypeActions.reset({
          name: "",
          type: BLANK_TYPE.slice(0) as OPT512Maybe,
        })
      }
    >
      reset
    </button>
  </div>
)

const Permalink = props => (
  <a href={`#?type[]=${props.typeText}`} title={props.typeText} target="_blank">
    permalink
  </a>
)

export function TypeThing({
  selected = false,
  defaultType,
  onClose = null,
  onChangeText = null,
  showOPTable = true,
}) {
  const [isOpen, setIsOpen] = React.useState(selected)
  const [opType, opTypeActions] = useUndo({
    name: String(defaultType.split(SEPARATOR)[1] || ""),
    type: parseCoinText(cleanCoinText(defaultType.split(SEPARATOR)[0])),
  })
  const opTypeInstance = new OPT512(opType.present.type)
  const typeText = opTypeInstance.OP512
  const displayName = opType.present.name || typeText

  React.useEffect(() => {
    if (onChangeText) {
      onChangeText(
        `${typeText}${
          opType.present.name ? SEPARATOR + opType.present.name : ""
        }`,
      )
    }
  }, [opType.present.name, typeText])

  return (
    <div className="TypeThing" data-is-open={isOpen}>
      <style jsx global>{`
        .TypeThing {
          transition: all 0.25s ease-in-out;
          box-sizing: border-box;
          padding: 2em 1ex;
        }

        .TypeThing {
          width: 100%;
        }

        @media (max-width: 424px) {
          .TypeThing {
            width: 100%;
          }
        }
        @media (min-width: 425px) {
          .TypeThing {
            width: 50%;
          }
        }
        @media (min-width: 768px) {
          .TypeThing {
            width: 25%;
          }
        }
        @media (min-width: 1441px) {
          .TypeThing {
            width: calc(100% / 6);
          }
        }

        .TypeThing button {
          font-size: 0.9em;
        }

        .TypeThing input[type="text"],
        .TypeThing input:not([type]) {
          box-sizing: border-box;
          width: 100%;
        }
        .TypeThing:active input,
        .TypeThing:hover input {
          background-color: #ffffdd;
        }

        .TypeThing .spacer {
          margin: 1ex 0;
        }
      `}</style>
      <div
        style={{
          // fontSize: betweenX(16, 20),
          textAlign: "center",
          marginTop: betweenX(8, 16),
        }}
        onClick={e => {
          setIsOpen(!isOpen)
        }}
      >
        <div>
          <h3>
            {isOpen ? (
              <input
                style={{ font: "inherit", textAlign: "center", color: "#333" }}
                onClick={e => e.stopPropagation()}
                onChange={e =>
                  opTypeActions.set({
                    type: opType.present.type,
                    name: e.currentTarget.value,
                  })
                }
                value={opType.present.name}
                placeholder="Human Name"
              />
            ) : (
              <div style={{ padding: 3 }}>
                {opType.present.name ||
                  `${opTypeInstance.S1}/${opTypeInstance.S2}`}
              </div>
            )}
          </h3>
        </div>
        <OP_Type opType={opTypeInstance} />
        <div>
          <code>
            {isOpen ? (
              <OPCodeInput
                style={{ font: "inherit", textAlign: "center" }}
                onClick={e => e.stopPropagation()}
                coins={opTypeInstance.type}
                onParsed={type => {
                  opTypeActions.set({ name: opType.present.name, type })
                }}
              />
            ) : (
              <div style={{ padding: 3 }}>
                <OPTypeBinaryText type={opTypeInstance.type} />
              </div>
            )}
          </code>
        </div>
        {showOPTable && (
          <div className="spacer">
            <OPActivationTable op512={opTypeInstance} />
          </div>
        )}
        <AOPActivationTable op512={opTypeInstance} />
        <div style={{ height: betweenX(8, 16) }}></div>
      </div>
      {isOpen && (
        <div
          style={
            {
              // minWidth: 500
            }
          }
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              padding: `1ex`,
              background: "#eee",
            }}
          >
            <Permalink typeText={typeText}></Permalink>
            <Spacer />
            <History opTypeActions={opTypeActions}></History>
            <Spacer />
            {onClose && (
              <button onClick={onClose} title="Delete">
                🗑️
              </button>
            )}
          </div>
          <OPTypeBinaryForm
            type={opType.present.type}
            onChange={type => {
              opTypeActions.set({ name: opType.present.name, type })
            }}
          />
        </div>
      )}{" "}
    </div>
  )
}
