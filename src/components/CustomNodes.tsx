import { Handle, Position } from '@xyflow/react';

const FlatCircleNode = ({ data, color, size = 'w-14 h-14', isTarget = true, isSource = true, sourcePos, targetPos, hideLabel = false }: any) => {
  return (
    <div className="flex flex-col items-center justify-center relative cursor-pointer" onClick={data.onToggleExpand}>
      {isTarget && <Handle type="target" position={targetPos || Position.Left} className="w-1 h-1 !bg-transparent !border-none" />}
      
      <div className={`${size} rounded-full z-10 relative`} style={{ backgroundColor: color }}></div>
      
      {!hideLabel && (
        <div className="absolute top-full mt-2 flex flex-col items-center z-10 w-24">
          <span 
            className="text-xs font-medium text-[#333] whitespace-nowrap overflow-hidden text-ellipsis w-full text-center" 
            title={data.label}
          >
            {data.label}
          </span>
        </div>
      )}

      {isSource && <Handle type="source" position={sourcePos || Position.Right} className="w-1 h-1 !bg-transparent !border-none" />}
    </div>
  );
};

export const CenterNode = ({ data }: any) => {
  return <FlatCircleNode data={data} color={data.color} size="w-16 h-16" isTarget={false} sourcePos={Position.Right} />;
};

export const BrandNode = ({ data, sourcePosition, targetPosition }: any) => {
  return (
    <div className="flex flex-col items-center justify-center relative cursor-pointer group" onClick={data.onToggleExpand}>
      <Handle type="target" position={targetPosition || Position.Left} className="w-1 h-1 !bg-transparent !border-none" />
      <div className="w-20 h-20 rounded-2xl z-10 relative flex items-center justify-center shadow-lg transition-transform group-hover:scale-105" style={{ backgroundColor: data.color }}>
        <span className="text-white font-bold text-sm text-center px-2">{data.label}</span>
      </div>
      <Handle type="source" position={sourcePosition || Position.Right} className="w-1 h-1 !bg-transparent !border-none" />
    </div>
  );
};

export const ProductNode = ({ data, sourcePosition, targetPosition }: any) => {
  return (
    <div className="flex flex-col items-center justify-center relative cursor-pointer group" onClick={data.onToggleExpand || data.onToggle}>
      <Handle type="target" position={targetPosition || Position.Left} className="w-1 h-1 !bg-transparent !border-none" />
      <div className="px-4 py-2 rounded-lg z-10 relative shadow-md border-2 bg-white transition-transform group-hover:scale-105" style={{ borderColor: data.color }}>
        <span className="text-sm font-bold whitespace-nowrap" style={{ color: data.color }}>{data.label}</span>
      </div>
      <Handle type="source" position={sourcePosition || Position.Right} className="w-1 h-1 !bg-transparent !border-none" />
    </div>
  );
};

export const BusinessNode = ({ data, targetPosition }: any) => {
  return <FlatCircleNode data={data} color="#E91E63" size="w-10 h-10" isSource={false} targetPos={targetPosition} />;
};

// Custom Background Group Node
export const GroupBgNode = ({ data }: any) => {
  return (
    <div 
      className="rounded-xl absolute border border-transparent pointer-events-none"
      style={{ 
        width: data.width, 
        height: data.height, 
        backgroundColor: data.color, 
        opacity: 0.08,
        zIndex: -1
      }}
    >
      <div className="absolute top-6 left-6 font-bold text-2xl" style={{ color: data.textColor, opacity: 1 }}>
        {data.label}
      </div>
    </div>
  );
};
